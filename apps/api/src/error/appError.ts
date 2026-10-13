export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public errorCode = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
