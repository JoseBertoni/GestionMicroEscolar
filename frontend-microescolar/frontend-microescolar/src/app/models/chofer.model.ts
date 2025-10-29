export interface Chofer {
  nombre: string;
  dni: string;
  microPatente?: string | null;
  nombreCompleto?: string; 
  microAsignado?: string; 
}

export interface ChoferRequest {
  nombre: string;
  dni: string;
}
