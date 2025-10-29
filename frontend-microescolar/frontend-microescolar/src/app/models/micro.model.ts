export interface Chofer {
  dni: string;
  nombre: string;
}

export interface Chico {
  dni: string;
  nombre: string;
}

export interface Micro {
  patente: string;
  chofer?: Chofer | null;
  chicos?: Chico[];
}

export interface MicroRequest {
  patente: string;
}
