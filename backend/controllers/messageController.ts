
import { Request, Response } from "express";
import Message, { IMessage } from "../models/Message";
import Channel from "../models/Channel";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";

// Get messages from a channel
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;
    
    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    let query: any = { channelId: new mongoose.Types.ObjectId(channelId) };
    
    // For pagination - get messages before a certain message ID
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
    
    // Return messages in chronological order
    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { content, senderName, senderId, isGuest = false } = req.body;
    
    // Check if channel exists
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
        isGuest
      }
    });
    
    await message.save();
    
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
    const mediaType = file.mimetype.startsWith('image/') ? 'image' : 
                    file.mimetype.startsWith('video/') ? 'video' : 'file';
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: mediaType === 'video' ? 'video' : 'auto',
      folder: 'edusync/community'
    });
    
    // Create message with media
    const message = new Message({
      channelId,
      content: content || `Shared a ${mediaType}`,
      sender: {
        id: senderId || undefined,
        name: senderName,
        isGuest
      },
      mediaUrl: result.secure_url,
      mediaType
    });
    
    await message.save();
    
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }
    
    // If message has media, delete from Cloudinary
    if (message.mediaUrl) {
      // Extract public_id from Cloudinary URL
      const publicId = message.mediaUrl.split('/').slice(-1)[0].split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`edusync/community/${publicId}`, {
          resource_type: message.mediaType === 'video' ? 'video' : 'image'
        });
      }
    }
    
    await Message.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
