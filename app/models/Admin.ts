import { RowDataPacket } from 'mysql2';
import db from '../lib/db';
import bcrypt from 'bcryptjs';

export interface Admin extends RowDataPacket {
  adminId: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createAdmin(data: Omit<Admin, 'createdAt' | 'updatedAt'>): Promise<Admin | null> {
  const stmt = db.prepare(`
    INSERT INTO admins (
      adminId, username, email, password, role
    ) VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.adminId,
    data.username,
    data.email,
    data.password,
    data.role
  );

  return findAdminById(data.adminId);
}

export async function findAdminById(adminId: string): Promise<Admin | null> {
  const stmt = db.prepare('SELECT * FROM admins WHERE adminId = ?');
  return stmt.get(adminId) as Admin | null;
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const stmt = db.prepare('SELECT * FROM admins WHERE email = ?');
  return stmt.get(email) as Admin | null;
}

export async function findAdminByUsername(username: string): Promise<Admin | null> {
  const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
  return stmt.get(username) as Admin | null;
}

export async function updateAdmin(
  adminId: string,
  data: Partial<Omit<Admin, 'adminId' | 'createdAt' | 'updatedAt'>>
): Promise<Admin | null> {
  const fields = Object.keys(data);
  if (fields.length === 0) return null;

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = [...fields.map(field => data[field as keyof typeof data]), adminId];

  const stmt = db.prepare(`
    UPDATE admins 
    SET ${setClause}
    WHERE adminId = ?
  `);

  stmt.run(...values);
  return findAdminById(adminId);
}

export async function deleteAdmin(adminId: string): Promise<boolean> {
  const stmt = db.prepare('DELETE FROM admins WHERE adminId = ?');
  const result = stmt.run(adminId);
  return result.changes > 0;
}

export async function getAllAdmins(): Promise<Admin[]> {
  const stmt = db.prepare('SELECT * FROM admins ORDER BY createdAt DESC');
  return stmt.all() as Admin[];
}

export async function getAdminsByRole(role: Admin['role']): Promise<Admin[]> {
  const stmt = db.prepare('SELECT * FROM admins WHERE role = ? ORDER BY createdAt DESC');
  return stmt.all(role) as Admin[];
}

const adminModel = {
  createAdmin,
  findAdminById,
  findAdminByEmail,
  findAdminByUsername,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdminsByRole
};

export default adminModel;