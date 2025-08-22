import { Request, Response, NextFunction } from 'express';


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

export const sendApiResponse = (res: Response, statusCode: number, message: string, data?: any) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message: message,
        data: data,
    });
};
