import express from 'express';
import cors from 'cors';
import  mongoose, { Schema }  from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://localhost:27017/helpers')
    .then(() => {
    console.log('Connected to MongoDB');
    }).catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new Schema({
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

// PUT route for updating a helper
app.put('/api/helpers/:id', async (req, res) => {
    console.log('Update request received for ID:', req.params.id);
    console.log('Update data:', req.body);
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('User updated successfully:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/api/helpers/:id', async (req, res) => {
  console.log('Delete request received for ID:', req.params.id);
     try{
        const userId = req.params.id;
        console.log('Attempting to delete user with ID:', userId);
        
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('User deleted successfully:', deletedUser);
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
     }
     catch(error){
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
     }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});