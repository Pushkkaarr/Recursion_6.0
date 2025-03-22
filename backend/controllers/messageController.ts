import { Request, Response } from "express";
import Message, { IMessage } from "../models/Message";
import Channel from "../models/Channel";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import fs from 'fs/promises'; // For file cleanup
import { Server } from "socket.io"; // Import Socket.io server type

// Assume socket.io instance is accessible globally or passed via a module
declare global {
  var io: Server; // This assumes you set up io in your server.ts and export it
}

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    let query: any = { channelId: new mongoose.Types.ObjectId(channelId) };

    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { content, senderName, senderId, isGuest = false } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const message = new Message({
      channelId,
      content,
      sender: {
        id: senderId || undefined,
        name: senderName,
        isGuest,
      },
    });

    await message.save();

    // Emit the new message to all clients in the channel
    global.io.to(channelId).emit('newMessage', message.toObject());

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Upload media for a message
export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    
    const { channelId } = req.params;
    const { content, senderName, senderId, isGuest = false } = req.body;
    
    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    // Get file details
    const file = req.file;
    console.log('File received:', file.path);
    
    const mediaType = file.mimetype.startsWith('image/') ? 'image' : 
                    file.mimetype.startsWith('video/') ? 'video' : 'file';
    
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: mediaType === 'video' ? 'video' : 'auto',
        folder: 'edusync/community'
      });
      
      console.log('Cloudinary upload successful:', result.secure_url);
      
      // Create message with media
      const message = new Message({
        channelId,
        content: content || `Shared a ${mediaType}`,
        sender: {
          id: senderId || undefined,
          name: senderName,
          isGuest: isGuest === 'true' || isGuest === true
        },
        mediaUrl: result.secure_url,
        mediaType
      });
      
      await message.save();
      
      // Clean up the temporary file after successful upload
      try {
        fs.unlinkSync(file.path);
        console.log('Temporary file deleted:', file.path);
      } catch (cleanupError) {
        console.error('Failed to delete temporary file:', cleanupError);
        // Continue execution even if cleanup fails
      }
      
      res.status(201).json(message);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      res.status(500).json({ message: "Failed to upload file to cloud storage", error: (cloudinaryError as Error).message });
    }
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    if (message.mediaUrl) {
      const publicId = message.mediaUrl.split('/').slice(-1)[0].split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`edusync/community/${publicId}`, {
          resource_type: message.mediaType === 'video' ? 'video' : 'image',
        });
      }
    }

    await Message.findByIdAndDelete(id);

    // Optionally emit a delete event if you want real-time updates for deletions
    global.io.to(message.channelId.toString()).emit('messageDeleted', id);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};