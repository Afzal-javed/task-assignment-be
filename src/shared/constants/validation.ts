export const VALIDATION = {
  USER: {
    FULL_NAME: { MIN_LENGTH: 2, MAX_LENGTH: 100 },
    PASSWORD: { MIN_LENGTH: 8, MAX_LENGTH: 128 },
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  TASK: {
    TITLE: { MIN_LENGTH: 1, MAX_LENGTH: 200 },
    DESCRIPTION: { MAX_LENGTH: 5000 },
  },
} as const;

export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  TOKEN_BLACKLIST: 'token_blacklist',
} as const;
