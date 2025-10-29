export interface Chofer {
  nombreCompleto: string;
  dni: string;
  micro?: string | null;
}

export interface ChoferRequest {
  nombre: string;
  apellido: string;
  dni: string;
}
