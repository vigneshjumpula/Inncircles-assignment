import User , {IUser} from '../models/user';

class UserService{
    async getAllUsers(){
        const users=await User.find();
        return users;
    }

    async createUser(userData: any, files: any){
        
        let languages = [];
        if (userData.languages) {
            if (typeof userData.languages === 'string') {
                try {
                    const parsed = JSON.parse(userData.languages);
                    if (Array.isArray(parsed)) {
                        languages = parsed;
                    } else {
                        languages = userData.languages.split(',').map((lang: string) => lang.trim());
                    }
                } catch {
                    languages = userData.languages.split(',').map((lang: string) => lang.trim());
                }
            } else {
                languages = userData.languages;
            }
        }

        const newUser = new User({
            ...userData,
            languages,
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
        if (!existingUser) {
            throw new Error('User not found');
        }

        let languages = [];
        if (userData.languages) {
            if (typeof userData.languages === 'string') {
                try {
                    const parsed = JSON.parse(userData.languages);
                    if (Array.isArray(parsed)) {
                        languages = parsed;
                    } else {
                        languages = userData.languages.split(',').map((lang: string) => lang.trim());
                    }
                } catch {
                    languages = userData.languages.split(',').map((lang: string) => lang.trim());
                }
            } else {
                languages = userData.languages;
            }
        }

        const updateData = {
            ...userData,
            languages,
            phone_number: Number(userData.phone_number),
            profile: files?.profile?.filename || existingUser.profile,
            kyc: files?.kyc?.filename || existingUser.kyc,
            document: files?.document?.filename || existingUser.document
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return updatedUser;
    }

    async deleteUser(userId: string) {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    }
}

export default new UserService();
