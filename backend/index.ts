import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"; // Import user routes
import pool from "./config/db_post" ; // Import Pool from pg


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Test PostgreSQL connection
app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Simple query to test connection
    res.send(`PostgreSQL connected! Server time is ${result.rows[0].now}`);
  } catch (err) {
    console.error("Error testing PostgreSQL connection:", err);
    res.status(500).send("Internal Server Error");
  }
});

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