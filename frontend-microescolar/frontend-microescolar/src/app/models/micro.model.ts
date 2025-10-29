export interface Micro {
  patente: string;
  chofer?: string | null;
  chicosAsignados?: string[];
}

export interface MicroRequest {
  patente: string;
}
