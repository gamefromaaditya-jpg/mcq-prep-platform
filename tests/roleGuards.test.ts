import { describe, it, expect } from 'vitest';
import { isRoleAuthorized, getDefaultRedirectPath } from '../src/utils/roleGuards';

describe('Role Authorization Utilities', () => {
  it('correctly authorizes matched roles', () => {
    expect(isRoleAuthorized('student', ['student', 'teacher'])).toBe(true);
    expect(isRoleAuthorized('admin', ['admin'])).toBe(true);
  });

  it('rejects unauthorized roles or missing role', () => {
    expect(isRoleAuthorized('student', ['teacher', 'admin'])).toBe(false);
    expect(isRoleAuthorized(null, ['student'])).toBe(false);
    expect(isRoleAuthorized(undefined, ['admin'])).toBe(false);
  });

  it('provides correct default dashboard routes', () => {
    expect(getDefaultRedirectPath('admin')).toBe('/admin/dashboard');
    expect(getDefaultRedirectPath('teacher')).toBe('/teacher/dashboard');
    expect(getDefaultRedirectPath('student')).toBe('/student/dashboard');
    expect(getDefaultRedirectPath(null)).toBe('/login');
  });
});
