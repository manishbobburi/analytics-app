import { ApiResponse } from '../../types/api.types.js';

export default function successResponse<T>(
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}
