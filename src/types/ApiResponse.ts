export interface ApiResponse<T> {
    status: any;
    success: boolean;
    message: string;
    transactionId: any;
    data?: T;
    error?: string;
  }
  