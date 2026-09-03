import { api } from '@/lib/api';
import type { AuthTokenResponse, LoginInput, SignupInput } from './types';

export async function login(input: LoginInput): Promise<AuthTokenResponse> {
  return api.post<AuthTokenResponse>('/auth/login', input);
}

export async function refreshAccessToken(): Promise<AuthTokenResponse> {
  return api.post('/auth/refresh');
}

export async function signup(input: SignupInput): Promise<void> {
  return api.post('/organization/create-organization', input);
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
