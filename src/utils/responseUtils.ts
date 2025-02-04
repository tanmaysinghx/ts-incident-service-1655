import { ApiResponse } from '../types/ApiResponse';

export const successResponse = <T>(status: any, data: T, message: string, transactionId: any): ApiResponse<T> => ({
  status,
  success: true,
  transactionId,
  message,
  data,
});

export const errorResponse = (status: any, error: string, message: string, transactionId: any): ApiResponse<null> => ({
  status,
  success: false,
  transactionId,
  message,
  error,
});
