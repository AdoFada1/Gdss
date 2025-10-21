import { IndexedEntity } from "./core-utils";
import type { Admin, Staff, Student, Result } from "@shared/types";
// MOCK DATA
const MOCK_ADMIN: Admin = {
  id: 'admin-1',
  name: 'Waziri Ibrahim',
  email: 'admin@gdss.com',
  role: 'admin',
  photoUrl: 'https://i.pravatar.cc/150?u=admin-1',
  password: 'password',
};
const MOCK_STAFF: Staff[] = [
  { id: 'staff-1', name: 'Mr. John Doe', email: 'staff@gdss.com', role: 'staff', title: 'Mathematics Teacher', photoUrl: 'https://i.pravatar.cc/150?u=staff-1', password: 'password', phone: '123-456-7890' },
  { id: 'staff-2', name: 'Mrs. Jane Smith', email: 'j.smith@gdss.com', role: 'staff', title: 'English Teacher', photoUrl: 'https://i.pravatar.cc/150?u=staff-2', password: 'password', phone: '098-765-4321' },
];
const MOCK_STUDENTS: Student[] = [
  { id: 'student-1', name: 'Alice Johnson', email: 'student@gdss.com', role: 'student', studentId: 'GDSS001', class: 'SS3', photoUrl: 'https://i.pravatar.cc/150?u=student-1', password: 'password' },
  { id: 'student-2', name: 'Bob Williams', email: 'b.williams@gdss.com', role: 'student', studentId: 'GDSS002', class: 'SS2', photoUrl: 'https://i.pravatar.cc/150?u=student-2', password: 'password' },
  { id: 'student-3', name: 'Charlie Brown', email: 'c.brown@gdss.com', role: 'student', studentId: 'GDSS003', class: 'SS1', photoUrl: 'https://i.pravatar.cc/150?u=student-3', password: 'password' },
  { id: 'student-4', name: 'Diana Miller', email: 'd.miller@gdss.com', role: 'student', studentId: 'GDSS004', class: 'SS3', photoUrl: 'https://i.pravatar.cc/150?u=student-4', password: 'password' },
  { id: 'student-5', name: 'Ethan Davis', email: 'e.davis@gdss.com', role: 'student', studentId: 'GDSS005', class: 'SS2', photoUrl: 'https://i.pravatar.cc/150?u=student-5', password: 'password' },
];
const MOCK_RESULTS: Result[] = [
    { id: 'result-1', studentId: 'student-1', subject: 'Mathematics', score: 85, term: 'First', session: '2023/2024', grade: 'A', remarks: 'Excellent work.' },
    { id: 'result-2', studentId: 'student-1', subject: 'English', score: 92, term: 'First', session: '2023/2024', grade: 'A+', remarks: 'Outstanding performance.' },
    { id: 'result-3', studentId: 'student-2', subject: 'Mathematics', score: 78, term: 'First', session: '2023/2024', grade: 'B', remarks: 'Good effort.' },
];
// ENTITIES
export class AdminEntity extends IndexedEntity<Admin> {
  static readonly entityName = "admin";
  static readonly indexName = "admins";
  static readonly initialState: Admin = { id: "", name: "", email: "", role: "admin", password: "" };
  static seedData = [MOCK_ADMIN];
}
export class StaffEntity extends IndexedEntity<Staff> {
  static readonly entityName = "staff";
  static readonly indexName = "staff_members";
  static readonly initialState: Staff = { id: "", name: "", email: "", role: "staff", title: "", password: "", phone: "" };
  static seedData = MOCK_STAFF;
}
export class StudentEntity extends IndexedEntity<Student> {
  static readonly entityName = "student";
  static readonly indexName = "students";
  static readonly initialState: Student = { id: "", name: "", email: "", role: "student", studentId: "", class: "SS1", password: "" };
  static seedData = MOCK_STUDENTS;
}
export class ResultEntity extends IndexedEntity<Result> {
    static readonly entityName = "result";
    static readonly indexName = "results";
    static readonly initialState: Result = { id: "", studentId: "", subject: "", score: 0, term: "First", session: "", grade: "", remarks: "" };
    static seedData = MOCK_RESULTS;
}