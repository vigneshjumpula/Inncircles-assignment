import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import User, { IUser } from '../models/user';

// Extend Request for multer files
interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => 
    cb(null, path.join(__dirname, '../uploads')),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => 
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// GET: Fetch all helpers
router.get('/', async (_req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error fetching helpers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Create a new helper
router.post(
  '/',
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'kyc', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      let languages: string[] = [];
      if (req.body.languages) {
        try {
          languages = JSON.parse(req.body.languages);
        } catch {
          languages = req.body.languages.split(',').map((lang: string) => lang.trim());
        }
      }

      const files = (req as MulterRequest).files;

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
  }
);

// PUT: Update a helper
router.put(
  '/:id',
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'kyc', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = (req as MulterRequest).files;

      let languages: string[] = [];
      if (req.body.languages) {
        try {
          languages = JSON.parse(req.body.languages);
        } catch {
          languages = req.body.languages.split(',').map((lang: string) => lang.trim());
        }
      }

      const { languages: _ignore, ...rest } = req.body;

      const updateData: Partial<IUser> = {
        ...rest,
        languages,
        phone_number: Number(req.body.phone_number)
      };

      if (files?.profile?.[0]) updateData.profile = files.profile[0].filename;
      if (files?.kyc?.[0]) updateData.kyc = files.kyc[0].filename;

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// DELETE: Delete a helper
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
