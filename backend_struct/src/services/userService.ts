import User , {IUser} from '../models/user';

class UserService{
    async getAllUsers(){
        const users=await User.find();
        return users;
    }
    async createUser(userData: any, files: any){
        const newUser = new User({
            ...userData,
            phone_number: Number(userData.phone_number),
            profile: files?.profile?.filename || '',
            kyc: files?.kyc?.filename || '',
            document: files?.document?.filename || ''
        });
        
        await newUser.save();
        return newUser;
    }

    async updateUser(userId: string, userData: any, files: any) {
        const existingUser = await User.findById(userId);
        if(!existingUser) {
            throw new Error('User not found');
        }
        const updateData = {
            ...userData,
            phone_number: Number(userData.phone_number),
            profile: files?.profile?.filename || existingUser.profile,
            kyc: files?.kyc?.filename || existingUser.kyc,
            document: files?.document?.filename || existingUser.document
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return updatedUser;
    }

    async deleteUser(userId: string) {
        console.log("hii");
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(__dirname, '../uploads');
        const filesToDelete = [user.profile, user.kyc, user.document];
        //console.log("Files to delete:", filesToDelete);
        filesToDelete.forEach((file) => {
            if (file) {
                const filePath = path.join(uploadsDir, file);
                console.log("Checking file:", filePath);
                console.log(fs.existsSync(filePath));
                if (fs.existsSync(filePath)) {
                    console.log("deleting the file:", filePath);
                    fs.unlinkSync(filePath);
                }
            }
        });
        const deletedUser = await User.findByIdAndDelete(userId);
        return deletedUser;
    }
}

export default new UserService();
