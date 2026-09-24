import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from '@/features/auth/auth-store';
import type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from '@/types/api.types';
import type { AuthTokenResponse } from '@/features/auth/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

let onAuthFailure: (() => void) | null = null;

export function registerAuthFailureHandler(handler: () => void) {
  onAuthFailure = handler;
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;

  return url.endsWith('/login') || url.endsWith('/refresh') || url.endsWith('/logout');
}

function toApiError(error: AxiosError<ApiErrorResponse>): ApiError {
  const body = error.response?.data;

  const message = body?.error?.message ?? 'Something went wrong';

  const errorCode = body?.error?.code ?? 'UNKNOWN_ERROR';

  return new ApiError(message, error.response?.status, errorCode, body?.error?.details);
}

function getNetworkErrorMessage(error: AxiosError): string {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection.';
  }

  return 'Unable to connect to the server. Please try again.';
}

async function refreshToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post<ApiSuccessResponse<AuthTokenResponse>>('/auth/refresh')
      .then((response) => {
        const token = response.data.data.accessToken;

        setAccessToken(token);

        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError(getNetworkErrorMessage(error), undefined, 'NETWORK_ERROR')
      );
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const status = error.response.status;

    if (status !== 401 || !originalRequest || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(toApiError(error));
    }

    if (originalRequest._retry) {
      clearAccessToken();

      onAuthFailure?.();

      return Promise.reject(toApiError(error));
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshToken();

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance.request(originalRequest);
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && !refreshError.response) {
        return Promise.reject(
          new ApiError(
            'Unable to refresh your session. Please check your connection.',
            undefined,
            'NETWORK_ERROR'
          )
        );
      }
      clearAccessToken();
      onAuthFailure?.();

      return Promise.reject(toApiError(refreshError as AxiosError<ApiErrorResponse>));
    }
  }
);

export async function requestDownload(
  config: AxiosRequestConfig
): Promise<{ blob: Blob; filename?: string }> {
  const response = await axiosInstance.request<Blob>({
    ...config,
    responseType: 'blob',
  });

  const contentDisposition = response.headers['content-disposition'];

  const filename = contentDisposition?.match(/filename="?([^"]+)"?/)?.[1];

  return {
    blob: response.data,
    filename,
  };
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<ApiResponse<T>>(config);

  if (response.status === 204) {
    return undefined as T;
  }

  if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
    return response.data as T;
  }

  const body = response.data;

  if (!body) {
    throw new ApiError('Empty response from server', response.status, 'EMPTY_RESPONSE');
  }

  if (!body.success) {
    throw new ApiError(body.error.message, response.status, body.error.code, body.error.details);
  }

  return body.data;
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
};
