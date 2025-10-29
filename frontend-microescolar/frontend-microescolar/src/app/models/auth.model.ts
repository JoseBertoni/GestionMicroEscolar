export interface User {
  id: number;
  nombre: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface ApiError {
  message: string;
  details?: string;
}