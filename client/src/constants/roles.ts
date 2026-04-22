// Centralized user role constants

export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: 'Owner' },
  { value: USER_ROLES.EDITOR, label: 'Editor' },
  { value: USER_ROLES.VIEWER, label: 'Viewer' },
] as const;

export const ROLE_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  [USER_ROLES.OWNER]: 'default',
  [USER_ROLES.ADMIN]: 'default',
  [USER_ROLES.EDITOR]: 'secondary',
  [USER_ROLES.VIEWER]: 'outline',
};
