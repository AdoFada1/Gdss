export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'admin' | 'staff' | 'student';
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  password?: string;
}
export interface Admin extends BaseUser {
  role: 'admin';
}
export interface Staff extends BaseUser {
  role: 'staff';
  title: string; // e.g., 'Mathematics Teacher'
  phone?: string;
}
export type StudentClass = 'SS1' | 'SS2' | 'SS3';
export interface Student extends BaseUser {
  role: 'student';
  studentId: string;
  class: StudentClass;
}
export interface Result {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  term: 'First' | 'Second' | 'Third';
  session: string; // e.g., '2023/2024'
  grade?: string;
  remarks?: string;
}
export type AnyUser = Admin | Staff | Student;