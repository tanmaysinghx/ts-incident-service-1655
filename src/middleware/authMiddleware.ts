import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';

export const validateJWT: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json(new ApiResponse('Unauthorized', null, 401));
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json(new ApiResponse('Invalid token', null, 401));
  }
};