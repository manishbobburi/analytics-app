export type { GetOrganizationResponse } from '@app/shared';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}
