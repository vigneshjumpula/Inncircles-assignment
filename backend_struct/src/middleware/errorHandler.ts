import { Request, Response, NextFunction } from 'express';


export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};


export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Error:', error.message);
    
 
    let statusCode = 500;
    let message = 'Something went wrong!';
    
 
    if (error.message === 'User not found') {
        statusCode = 404;
        message = 'User not found';
    }
    
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Invalid data provided';
    }
    
    
    res.status(statusCode).json({
        success: false,
        message: message
    });
};