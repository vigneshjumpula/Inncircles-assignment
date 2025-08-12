// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import mongoose, { Schema, Document } from 'mongoose';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/helpers')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// User Document interface
interface IUser extends Document {
  type_of_service: string;
  organization_name: string;
  full_name: string;
  languages: string[];
  gender: string;
  phone_number: number;
  email: string;
  choose_vehicle: string;
  kyc?: string;
  joined_date?: Date;
  employee_code?: number;
}
const userSchema = new Schema<IUser>({
    type_of_service: { type: String, required: true },
    organization_name: { type: String, required: true },
    full_name: { type: String, required: true },
    languages: { type: [String], required: true },
    gender: { type: String, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true },
    choose_vehicle: { type: String, required: true },
    kyc: { type: String, default: '' },
    joined_date: { type: Date, default: Date.now },
    employee_code: { type: Number },
});

const User = mongoose.model<IUser>('User', userSchema);
// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('API is running');
});

app.get('/api/helpers', async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching helpers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/helpers', async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.put('/api/helpers/:id', async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/helpers/:id', async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
