import mongoose, { Schema, Document } from "mongoose";

// Define interface for Student Progress
export interface IStudentProgress extends Document {
  studentId: mongoose.Types.ObjectId; // Reference to the student
  courses: {
    courseId: mongoose.Types.ObjectId;
    title: string;
    syllabusCompleted: number; // Percentage of syllabus completed (0-100)
    totalTimeSpent: number; // Total time spent on this course (in minutes)
    subjects: {
      subjectName: string;
      timeSpent: number; // Time spent on this subject (in minutes)
      isWeakSubject: boolean; // Whether this subject is weak
    }[];
  }[];
  totalLearningTime: number; // Total time spent on all courses (in minutes)
  completionRate: number; // Overall completion rate across courses
}

const StudentProgressSchema = new Schema<IStudentProgress>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courses: [
    {
      courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
      title: { type: String, required: true },
      syllabusCompleted: { type: Number, min: 0, max: 100, default: 0 },
      totalTimeSpent: { type: Number, default: 0 }, // Time in minutes
      subjects: [
        {
          subjectName: { type: String, required: true },
          timeSpent: { type: Number, default: 0 }, // Time in minutes
          isWeakSubject: { type: Boolean, default: false },
        },
      ],
    },
  ],
  totalLearningTime: { type: Number, default: 0 }, // Total time across all courses
  completionRate: { type: Number, min: 0, max: 100, default: 0 }, // Overall percentage
});

const StudentProgress = mongoose.model<IStudentProgress>(
  "StudentProgress",
  StudentProgressSchema
);

export default StudentProgress;
