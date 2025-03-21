
import mongoose, { Document, Schema } from "mongoose";

export interface IChannel extends Document {
  name: string;
  type: 'text' | 'voice' | 'video';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'voice', 'video'],
      required: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IChannel>("Channel", ChannelSchema);
