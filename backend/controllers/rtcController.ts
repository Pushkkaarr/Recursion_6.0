
import { Request, Response } from "express";
import Channel from "../models/Channel";

// Get ICE servers for WebRTC
export const getIceServers = async (req: Request, res: Response): Promise<void> => {
  try {
    // These can be environment variables in production
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      // Add TURN servers for production environment
      // { 
      //   urls: process.env.TURN_SERVER_URL,
      //   username: process.env.TURN_SERVER_USERNAME,
      //   credential: process.env.TURN_SERVER_CREDENTIAL
      // }
    ];
    
    res.status(200).json({ iceServers });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Check if a call is active in a channel
export const checkCallStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    
    // Check if channel exists and is voice/video type
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }
    
    if (channel.type !== 'voice' && channel.type !== 'video') {
      res.status(400).json({ message: "Channel is not a call channel" });
      return;
    }
    
    // In a real app, you might want to store active calls in a database
    // For this example, we'll just return a success response
    res.status(200).json({ active: true });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
