import mongoose, { Schema, Document } from "mongoose";

// Define interface for Meeting document
export interface IMeeting extends Document {
  title: string;
  description?: string;
  scheduledBy: mongoose.Types.ObjectId; // Reference to User who scheduled it
  scheduledAt: Date;
  startTime: Date;
  endTime: Date;
  timezone: string;
  participants: mongoose.Types.ObjectId[]; // List of users attending
  meetingLink?: string;
  location?: string;
  status: "Scheduled" | "Completed" | "Canceled";
  notes: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  attachments: string[]; // File links or attachments
}

// Define Mongoose schema
const MeetingSchema = new Schema<IMeeting>({
  title: { type: String, required: true },
  description: { type: String },
  scheduledBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  scheduledAt: { type: Date, default: Date.now },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timezone: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  meetingLink: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Canceled"],
    default: "Scheduled",
  },
  notes: [
    {
      author: { type: Schema.Types.ObjectId, ref: "User" },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  attachments: [{ type: String }],
});

// Export the Meeting model
const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);
export default Meeting;
