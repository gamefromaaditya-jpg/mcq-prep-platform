import { UserRole } from '../types';

export const isRoleAuthorized = (userRole: UserRole | null | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const getDefaultRedirectPath = (role: UserRole | null | undefined): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/login';
  }
};
