export interface Chofer {
  nombre: string;
  dni: string;
  microPatente?: string | null;
  nombreCompleto?: string; // Campo calculado para la tabla
  microAsignado?: string; // Campo calculado para mostrar en la tabla
}

export interface ChoferRequest {
  nombre: string;
  dni: string;
}
