import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"; // Import user routes
import checkConnection from "./config/db_supa";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Check Supabase connection
checkConnection();


app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api", userRoutes); // Mount user routes at /api

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});