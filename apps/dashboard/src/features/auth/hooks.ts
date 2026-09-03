import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, refreshAccessToken, signup } from './api';
import { clearAccessToken, setAccessToken } from './auth-store';

export function useLogin() {
  return useMutation({
    mutationFn: login,

    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
    },
  });
}

export async function bootstrapAuth(): Promise<boolean> {
  try {
    const { accessToken } = await refreshAccessToken();

    setAccessToken(accessToken);

    return true;
  } catch (err) {
    clearAccessToken();

    return false;
  }
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}
