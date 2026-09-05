import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, refreshAccessToken, signup, logout, getCurrentOrganization } from './api';
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

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}

export function useCurrentOrganization() {
  return useQuery({
    queryKey: ['auth', 'organization'],
    queryFn: getCurrentOrganization,
  });
}
