export interface Chico {
  dni: string;
  nombre: string;
  micro?: string; 
  microAsignado?: string; 
}

export interface ChicoRequest {
  dni: string;
  nombre: string;
  micro?: string; 
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}