export const rateLimitConfig = {
  global: {
    windowMs: 60 * 1000,
    limit: 300,
  },

  login: {
    windowMs: 15 * 60 * 1000,
    limit: 10,
  },

  register: {
    windowMs: 60 * 60 * 1000,
    limit: 5,
  },

  authenticatedApi: {
    windowMs: 60 * 1000,
    limit: 200,
  },

  mutationApi: {
    windowMs: 60 * 1000,
    limit: 10,
  },
} as const;
