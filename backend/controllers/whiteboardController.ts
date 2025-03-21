
import { Request, Response } from "express";
import mongoose from "mongoose";

// For simplicity, we'll use an in-memory storage for whiteboard data
// In production, you'd store this in a database
const whiteboardData: { [channelId: string]: any[] } = {};

// Get whiteboard data for a channel
export const getWhiteboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    
    // Return the whiteboard data for the channel, or an empty array if none exists
    res.status(200).json({ data: whiteboardData[channelId] || [] });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Save whiteboard data for a channel
export const saveWhiteboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    const { data } = req.body;
    
    if (!data) {
      res.status(400).json({ message: "No data provided" });
      return;
    }
    
    // Save the whiteboard data for the channel
    whiteboardData[channelId] = data;
    
    res.status(200).json({ message: "Whiteboard data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Clear whiteboard data for a channel
export const clearWhiteboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params;
    
    // Clear the whiteboard data for the channel
    whiteboardData[channelId] = [];
    
    res.status(200).json({ message: "Whiteboard data cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
