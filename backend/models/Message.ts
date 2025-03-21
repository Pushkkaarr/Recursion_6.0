
import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  channelId: mongoose.Types.ObjectId;
  sender: {
    id?: mongoose.Types.ObjectId;
    name: string;
    isGuest: boolean;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'file';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: true
    },
    sender: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        required: true
      },
      isGuest: {
        type: Boolean,
        default: false
      }
    },
    content: {
      type: String,
      required: true
    },
    mediaUrl: {
      type: String
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'file']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
