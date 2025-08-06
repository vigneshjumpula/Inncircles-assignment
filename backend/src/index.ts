import express from 'express';
import cors from 'cors';
import  mongoose, { Schema }  from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/helpers')
    .then(() => {
    console.log('Connected to MongoDB');
    }).catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new Schema({
  // id: { type: Number },
  upload_photo: { type: String, default: '' },
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
  employee_code: { type: Number }
});

const User = mongoose.model('User', userSchema);
app.get('/', (req, res) => {
  res.send('API is running');
  
});
app.get('/api/helpers', async (req, res) => {
   try {
    const users = await User.find({});
    res.json(users);
   } catch (error) {
    console.error('Error fetching helpers:', error);
    res.status(500).json({ error: 'Internal server error' });
   }
});



app.post('/api/helpers', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save user' });
    }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});