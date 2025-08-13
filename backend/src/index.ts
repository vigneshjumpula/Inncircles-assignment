import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import multer from 'multer';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Added JSON body parser middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));

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
  profile?: string;
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
    profile: { type: String, default: '' },
    kyc: { type: String, default: '' },
    joined_date: { type: Date, default: Date.now },
    employee_code: { type: Number },
});

const User = mongoose.model<IUser>('User', userSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

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

app.post('/api/helpers', upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'kyc', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const languages = req.body.languages ? JSON.parse(req.body.languages) : [];
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const newUser = new User({
      ...req.body,
      languages,
      phone_number: Number(req.body.phone_number),
      profile: files?.profile?.[0]?.filename || '',
      kyc: files?.kyc?.[0]?.filename || ''
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});


app.put('/api/helpers/:id', upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'kyc', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    console.log('Updating helper with ID:', req.params.id);
    console.log('Update text fields:', req.body);
    console.log('Update uploaded files:', req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Parse languages if it's a string
    let languages = req.body.languages;
    if (typeof languages === 'string') {
      try {
        languages = JSON.parse(languages);
      } catch {
        // If parsing fails, treat as comma-separated string
        languages = languages.split(',').map((lang: string) => lang.trim());
      }
    }

    const updateData: any = {
      ...req.body,
      languages,
      phone_number: Number(req.body.phone_number)
    };

    // Only update file paths if new files are uploaded
    if (files?.profile?.[0]) {
      updateData.profile = files.profile[0].filename;
    }
    if (files?.kyc?.[0]) {
      updateData.kyc = files.kyc[0].filename;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    console.log('Successfully updated user:', updatedUser);
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




