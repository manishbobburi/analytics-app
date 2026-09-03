import { api } from '@/lib/api';
import type { AuthTokenResponse, LoginInput } from './types';

export async function login(input: LoginInput): Promise<AuthTokenResponse> {
  return api.post<AuthTokenResponse>('/auth/login', input);
}

export async function refreshAccessToken(): Promise<AuthTokenResponse> {
  return api.post('/auth/refresh');
}
