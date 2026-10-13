export interface ErrorWithCode extends Error {
  statusCode?: number;
  errorCode?: string;
  details?: unknown;
}
