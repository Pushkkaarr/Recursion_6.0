
import { Request, Response } from "express";
import Channel, { IChannel } from "../models/Channel";

// Get all channels
export const getChannels = async (req: Request, res: Response): Promise<void> => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create a new channel
export const createChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, description } = req.body;
    
    if (!name || !type) {
      res.status(400).json({ message: "Name and type are required" });
      return;
    }
    
    if (!['text', 'voice', 'video'].includes(type)) {
      res.status(400).json({ message: "Type must be 'text', 'voice', or 'video'" });
      return;
    }
    
    const channel = new Channel({ name, type, description });
    await channel.save();
    
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Get a specific channel by ID
export const getChannelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update a channel
export const updateChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedChannel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete a channel
export const deleteChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedChannel = await Channel.findByIdAndDelete(req.params.id);
    
    if (!deletedChannel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
