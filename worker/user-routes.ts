import { Hono } from "hono";
import type { Env } from './core-utils';
import { AdminEntity, StaffEntity, StudentEntity, ResultEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { UserRole, Student, Staff, Result, AnyUser } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('*', async (c, next) => {
    await Promise.all([
      AdminEntity.ensureSeed(c.env),
      StaffEntity.ensureSeed(c.env),
      StudentEntity.ensureSeed(c.env),
      ResultEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // MOCK AUTHENTICATION
  app.post('/api/auth/login', async (c) => {
    const { email, role, password } = (await c.req.json()) as { email?: string; role?: UserRole, password?: string };
    if (!email || !role) return bad(c, 'Email and role are required');
    let user;
    if (role === 'admin') {
      const admins = await AdminEntity.list(c.env);
      user = admins.items.find(u => u.email === email);
    } else if (role === 'staff') {
      const staff = await StaffEntity.list(c.env);
      user = staff.items.find(u => u.email === email);
    } else if (role === 'student') {
      const students = await StudentEntity.list(c.env);
      user = students.items.find(u => u.email === email);
    }
    // Mock password check
    if (!user || user.password !== password) return notFound(c, 'User not found or password incorrect');
    // Don't send password to client
    const { password: _, ...userClientData } = user;
    return ok(c, userClientData);
  });
  // PROFILE MANAGEMENT
  app.put('/api/profile', async (c) => {
    const { id, role, name, photoUrl } = await c.req.json<{ id: string; role: UserRole; name: string; photoUrl?: string }>();
    if (!id || !role || !name) return bad(c, 'ID, role, and name are required');
    let entity;
    if (role === 'admin') entity = new AdminEntity(c.env, id);
    else if (role === 'staff') entity = new StaffEntity(c.env, id);
    else if (role === 'student') entity = new StudentEntity(c.env, id);
    else return bad(c, 'Invalid user role');
    if (!(await entity.exists())) return notFound(c, 'User not found');
    await entity.patch({ name, photoUrl });
    const state = await entity.getState();
    const { password, ...clientState } = state;
    return ok(c, clientState);
  });
  app.put('/api/profile/credentials', async (c) => {
    const { id, role, email, password } = await c.req.json<{ id: string; role: UserRole; email: string; password?: string }>();
    if (!id || !role || !email) return bad(c, 'ID, role, and email are required');
    let entity;
    if (role === 'admin') entity = new AdminEntity(c.env, id);
    else if (role === 'staff') entity = new StaffEntity(c.env, id);
    else if (role === 'student') entity = new StudentEntity(c.env, id);
    else return bad(c, 'Invalid user role');
    if (!(await entity.exists())) return notFound(c, 'User not found');
    const patchData: { email: string; password?: string } = { email };
    if (password) {
      patchData.password = password;
    }
    await entity.patch(patchData);
    const state = await entity.getState();
    const { password: _, ...clientState } = state;
    return ok(c, clientState);
  });
  // ADMIN: STUDENTS
  app.get('/api/students', async (c) => {
    const page = await StudentEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/students', async (c) => {
    const body = await c.req.json<Omit<Student, 'id' | 'role'>>();
    const newStudent: Student = { ...body, id: crypto.randomUUID(), role: 'student', password: body.password || 'password' };
    await StudentEntity.create(c.env, newStudent);
    return ok(c, newStudent);
  });
  app.put('/api/students/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Omit<Student, 'id' | 'role'>>>();
    const student = new StudentEntity(c.env, id);
    if (!(await student.exists())) return notFound(c);
    const patchData = { ...body };
    if (!patchData.password) {
      delete patchData.password;
    }
    await student.patch(patchData);
    return ok(c, await student.getState());
  });
  app.delete('/api/students/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await StudentEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id });
  });
  // ADMIN: STAFF
  app.get('/api/staff', async (c) => {
    const page = await StaffEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/staff', async (c) => {
    const body = await c.req.json<Omit<Staff, 'id' | 'role'>>();
    const newStaff: Staff = { ...body, id: crypto.randomUUID(), role: 'staff', password: body.password || 'password' };
    await StaffEntity.create(c.env, newStaff);
    return ok(c, newStaff);
  });
  app.put('/api/staff/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Omit<Staff, 'id' | 'role'>>>();
    const staff = new StaffEntity(c.env, id);
    if (!(await staff.exists())) return notFound(c);
    const patchData = { ...body };
    if (!patchData.password) {
      delete patchData.password;
    }
    await staff.patch(patchData);
    return ok(c, await staff.getState());
  });
  app.delete('/api/staff/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await StaffEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id });
  });
  // STAFF: RESULTS
  app.get('/api/results', async (c) => {
    const studentId = c.req.query('studentId');
    const page = await ResultEntity.list(c.env);
    if (studentId) {
      const items = page.items.filter((r) => r.studentId === studentId);
      return ok(c, { ...page, items });
    }
    return ok(c, page);
  });
  app.post('/api/results', async (c) => {
    const body = await c.req.json<Omit<Result, 'id'>>();
    const newResult: Result = { ...body, id: crypto.randomUUID() };
    await ResultEntity.create(c.env, newResult);
    return ok(c, newResult);
  });
  app.put('/api/results/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Omit<Result, 'id'>>();
    const result = new ResultEntity(c.env, id);
    if (!(await result.exists())) return notFound(c);
    await result.patch(body);
    return ok(c, await result.getState());
  });
  app.delete('/api/results/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ResultEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id });
  });
}