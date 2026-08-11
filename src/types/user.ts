export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  classId?: string;
  targetExam?: string; // e.g. 'JEE Main', 'NEET', 'GATE'
  enrolledSubjects?: string[];
  totalAttempted?: number;
  totalScore?: number;
}

export interface TeacherProfile extends UserProfile {
  role: 'teacher';
  assignedClasses?: string[];
  assignedSubjects?: string[];
  qualification?: string;
}

export interface AdminProfile extends UserProfile {
  role: 'admin';
  permissions?: string[];
}
