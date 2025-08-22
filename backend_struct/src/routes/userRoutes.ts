import { Router, Request, Response } from 'express';
import userController from '../controllers/userController';
import uploadFiles from '../config/multerconfig';

const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', uploadFiles, userController.createUser);
router.put('/:id', uploadFiles, userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
