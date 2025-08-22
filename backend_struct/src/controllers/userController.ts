import {Request,Response} from 'express';
import userService from '../services/userService'; 
import { sendApiResponse } from '../middleware/errorHandler';
import { send } from 'process';

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

class UserController{
    getAllUsers = async (req:Request, res:Response)=>{
      try {
        const users=await userService.getAllUsers();
        sendApiResponse(res, 200, 'Success', users);
      } 
      catch (error: any) {
        sendApiResponse(res, 500, error.message, null);
      }
    };

    createUser=async (req: Request, res: Response) => {
      try {
          const files = (req as MulterRequest).files;
          if(!files) {
          sendApiResponse(res, 400, 'No files uploaded. Uploading files is required.');
          return;
         }
        const fileData = {
            profile: files?.profile?.[0],
            kyc: files?.kyc?.[0],
            document: files?.document?.[0]
        };
        const newUser = await userService.createUser(req.body, fileData);
        sendApiResponse(res, 201, 'User created successfully', newUser);
      } catch (error: any) {
        sendApiResponse(res, 500, error.message, null);
      }

    };

   updateUser=async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
         if(!id){
          sendApiResponse(res, 400, 'User ID is required');
          return;
         }
        const files = (req as MulterRequest).files;
          if(!files) {
          sendApiResponse(res, 400, 'No files uploaded. Uploading files is required.');
          return;
         }
        const fileData = {
        profile: files?.profile?.[0],
        kyc: files?.kyc?.[0],
        document: files?.document?.[0]
        };
        const updatedUser = await userService.updateUser(id, req.body, fileData);
        sendApiResponse(res, 200, 'User updated successfully', updatedUser);
    }
    catch (error: any) {
        sendApiResponse(res, 500, error.message, null);
    }
   };

   deleteUser=async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if(!id){
        sendApiResponse(res, 400, 'User ID is required');
        return;
      }
      const deletedUser = await userService.deleteUser(id);
      sendApiResponse(res, 200, 'User deleted successfully', deletedUser);

    }
    catch{
      sendApiResponse(res, 500, 'Internal Server Error', null);
    }
   };


}

export default new UserController();
