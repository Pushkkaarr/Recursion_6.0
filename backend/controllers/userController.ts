import {Request, Response } from "express";
import { query } from '../config/db_post';
import User from "../models/User";
import { IUser } from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Demo Controller to handle fetching users using POSTGRESQL
// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Query the 'users' table
//     const result = await query<IUser>('SELECT * FROM users'); // Use IUser as the result type
//     if (result.rows.length === 0) {
//       res.status(404).json({ message: "No users found" });
//     } else {
//       res.status(200).json(result.rows); // Send the rows of the result
//     }
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// export const createUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Hardcoded users for testing
//     const hardcodedUsers: IUser[] = [
//       { name: "John Doe", email: "john@example.com", password: "password123", createdAt: new Date() },
//       { name: "Jane Doe", email: "jane@example.com", password: "password456", createdAt: new Date() },
//       { name: "Bob Smith", email: "bob@example.com", password: "password789", createdAt: new Date() },
//     ];

//     // Create the users table if it does not exist
//     await query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Insert each user into the database
//     for (const user of hardcodedUsers) {
//       const result = await query('INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [user.name, user.email, user.password, user.createdAt]);
//       console.log(`Created user: ${result.rows[0].name}`);
//     }

//     res.status(201).json(hardcodedUsers); // Return the newly created users
//   } catch (error) {
//     res.status(400).json({ message: (error as Error).message });
//   }
// };

