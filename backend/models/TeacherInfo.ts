import mongoose, { Schema, Document } from "mongoose";

// Define interface for Teacher Dashboard
export interface ITeacherDashboard extends Document {
  teacherId: mongoose.Types.ObjectId; // Reference to the teacher
  students: {
    studentId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    courses: {
      courseId: mongoose.Types.ObjectId;
      title: string;
      syllabusCompleted: number; // % syllabus completed (0-100)
      totalTimeSpent: number; // Total time spent in minutes
      subjects: {
        subjectName: string;
        timeSpent: number; // Time in minutes
        isWeakSubject: boolean;
      }[];
    }[];
    totalLearningTime: number; // Total learning time for this student
    completionRate: number; // Overall completion percentage
  }[];
  overallAverageCompletionRate: number; // Average completion rate of all students
  totalStudents: number; // Total students assigned to the teacher
}

const TeacherDashboardSchema = new Schema<ITeacherDashboard>({
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [
    {
      studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      courses: [
        {
          courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
          title: { type: String, required: true },
          syllabusCompleted: { type: Number, min: 0, max: 100, default: 0 },
          totalTimeSpent: { type: Number, default: 0 },
          subjects: [
            {
              subjectName: { type: String, required: true },
              timeSpent: { type: Number, default: 0 },
              isWeakSubject: { type: Boolean, default: false },
            },
          ],
        },
      ],
      totalLearningTime: { type: Number, default: 0 },
      completionRate: { type: Number, min: 0, max: 100, default: 0 },
    },
  ],
  overallAverageCompletionRate: { type: Number, min: 0, max: 100, default: 0 },
  totalStudents: { type: Number, default: 0 },
});

const TeacherDashboard = mongoose.model<ITeacherDashboard>(
  "TeacherDashboard",
  TeacherDashboardSchema
);

export default TeacherDashboard;
