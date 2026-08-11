export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  code: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
  fileUrls?: string[];
  createdAt: string;
}
