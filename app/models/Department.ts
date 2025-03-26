import { RowDataPacket } from 'mysql2';
import pool from '../lib/db';

export interface Department extends RowDataPacket {
  departmentId: string;
  departmentName: string;
  email: string;
  password: string;
  sectionName: string;
  employeeLevel: 'SC' | 'OS' | 'Head';
  createdAt: Date;
  updatedAt: Date;
}

export async function createDepartment(department: Omit<Department, 'createdAt' | 'updatedAt'>) {
  const [result] = await pool.execute(
    `INSERT INTO departments (departmentId, departmentName, email, password, sectionName, employeeLevel, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [department.departmentId, department.departmentName, department.email, department.password, department.sectionName, department.employeeLevel]
  );
  return result;
}

export async function findDepartmentById(departmentId: string) {
  const [rows] = await pool.execute<Department[]>(
    'SELECT * FROM departments WHERE departmentId = ?',
    [departmentId]
  );
  return rows[0];
}

export async function findDepartmentByEmail(email: string) {
  const [rows] = await pool.execute<Department[]>(
    'SELECT * FROM departments WHERE email = ?',
    [email]
  );
  return rows[0];
}

export async function updateDepartment(departmentId: string, updates: Partial<Department>) {
  const [result] = await pool.execute(
    `UPDATE departments 
     SET ${Object.keys(updates).map(key => `${key} = ?`).join(', ')}, updatedAt = NOW()
     WHERE departmentId = ?`,
    [...Object.values(updates), departmentId]
  );
  return result;
}

export async function deleteDepartment(departmentId: string) {
  const [result] = await pool.execute(
    'DELETE FROM departments WHERE departmentId = ?',
    [departmentId]
  );
  return result;
}

// SQL for creating the departments table
export const createDepartmentsTableSQL = `
CREATE TABLE IF NOT EXISTS departments (
  departmentId VARCHAR(255) PRIMARY KEY,
  departmentName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  sectionName VARCHAR(255) NOT NULL,
  employeeLevel ENUM('SC', 'OS', 'Head') NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`; 