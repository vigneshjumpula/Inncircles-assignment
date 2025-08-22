import {Request,Response} from 'express';
import userService from '../services/userService'; 
import { catchAsync } from '../middleware/errorHandler';

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

class UserController{
     getAllUsers=catchAsync(async (req:Request,res:Response)=>{
            const users=await userService.getAllUsers();
            res.json(users);
    });

    createUser=catchAsync(async (req: Request, res: Response): Promise<void> => {
           const files = (req as MulterRequest).files;
           const fileData = {
               profile: files?.profile?.[0],
               kyc: files?.kyc?.[0],
               document: files?.document?.[0]
           };
           const newUser = await userService.createUser(req.body, fileData);
           res.status(201).json(newUser);

    });

   updateUser=catchAsync(async (req: Request, res: Response): Promise<void> => {
       const { id } = req.params;
       const files = (req as MulterRequest).files;
           const fileData = {
               profile: files?.profile?.[0],
               kyc: files?.kyc?.[0],
               document: files?.document?.[0]
           };
           const updatedUser = await userService.updateUser(id, req.body, fileData);
           res.json(updatedUser);
       
   });

   deleteUser=catchAsync(async (req: Request, res: Response): Promise<void> => {
       const { id } = req.params;
              const deletedUser = await userService.deleteUser(id);
              res.json({ message: 'User deleted successfully', user: deletedUser });
         
   });


}

export default new UserController();
