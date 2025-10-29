export interface Chico {
  dni: string;
  nombre: string;
  micro?: string; // Opcional porque puede no estar asignado inicialmente
}

export interface ChicoRequest {
  dni: string;
  nombre: string;
  micro?: string; // Opcional, igual que en la interfaz Chico
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}