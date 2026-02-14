import { UserRole } from './auth';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  employee_id: string | null;
  role: UserRole;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
}

export interface OwnerCreate {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface EmployeeCreate {
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  employee_id?: string;
  password?: string;
}

export interface EmployeeCreateResponse {
  user: UserResponse;
  generated_password: string | null;
}

export interface UserUpdate {
  full_name?: string;
  password?: string;
}
