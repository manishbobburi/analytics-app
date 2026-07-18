import { ApiResponse } from '../../types/api.types.js';

export default function successResponse<T>(
  data?: T,
  options?: {
    message: string;
    meta?: Record<string, unknown>;
  }
): ApiResponse<T> {
  return {
    success: true,
    message: options?.message,
    data,
    meta: options?.meta,
  };
}
