import { Request, Response } from "express";
import Channel from "../models/Channel";
import twilio from 'twilio';

// Get ICE servers for WebRTC
export const getIceServers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Default public STUN servers
    let iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ];
    
    // If Twilio credentials are provided, use Twilio for TURN servers
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        
        const token = await twilioClient.tokens.create();
        iceServers = token.iceServers;
      } catch (twilioError) {
        console.error('Failed to get Twilio ICE servers:', twilioError);
        // Continue with public STUN servers only
      }
    } else {
      // Add a free TURN server as fallback
      // Note: For production, you should use your own TURN server or a service like Twilio
      iceServers.push({
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      });
    }
    
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
    
    // We would check active calls from socket data in a real app
    // This would be better implemented through the socket.io memory store
    
    res.status(200).json({ active: false });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};