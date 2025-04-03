import { RowDataPacket } from 'mysql2';
import db from '../lib/db';
import bcrypt from 'bcryptjs';

export interface Department extends RowDataPacket {
  departmentId: string;
  departmentName: string;
  email: string;
  password: string;
  sectionName: string;
  employeeLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createDepartment(data: Omit<Department, 'createdAt' | 'updatedAt'>): Promise<Department | null> {
  const stmt = db.prepare(`
    INSERT INTO departments (
      departmentId, departmentName, email, password, 
      sectionName, employeeLevel
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.departmentId,
    data.departmentName,
    data.email,
    data.password,
    data.sectionName,
    data.employeeLevel
  );

  return findDepartmentById(data.departmentId);
}

export async function findDepartmentById(departmentId: string): Promise<Department | null> {
  const stmt = db.prepare('SELECT * FROM departments WHERE departmentId = ?');
  return stmt.get(departmentId) as Department | null;
}

export async function findDepartmentByEmail(email: string): Promise<Department | null> {
  const stmt = db.prepare('SELECT * FROM departments WHERE email = ?');
  return stmt.get(email) as Department | null;
}

export async function updateDepartment(
  departmentId: string,
  data: Partial<Omit<Department, 'departmentId' | 'createdAt' | 'updatedAt'>>
): Promise<Department | null> {
  const fields = Object.keys(data);
  if (fields.length === 0) return null;

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = [...fields.map(field => data[field as keyof typeof data]), departmentId];

  const stmt = db.prepare(`
    UPDATE departments 
    SET ${setClause}
    WHERE departmentId = ?
  `);

  stmt.run(...values);
  return findDepartmentById(departmentId);
}

export async function deleteDepartment(departmentId: string): Promise<boolean> {
  const stmt = db.prepare('DELETE FROM departments WHERE departmentId = ?');
  const result = stmt.run(departmentId);
  return result.changes > 0;
}

export async function getAllDepartments(): Promise<Department[]> {
  const stmt = db.prepare('SELECT * FROM departments ORDER BY createdAt DESC');
  return stmt.all() as Department[];
}

const departmentModel = {
  createDepartment,
  findDepartmentById,
  findDepartmentByEmail,
  updateDepartment,
  deleteDepartment,
  getAllDepartments
};

export default departmentModel;