export type EstadoMateria = "pendiente" | "cursando" | "aprobada" | "reprobada";

export interface Materia {
  id: string;
  nombre: string;
  creditos: number;
  nivel: number; // semestre de la malla: 1 a 9
  prerrequisitos: string[]; // ids de otras materias
}

export interface Registro {
  materiaId: string;
  estado: EstadoMateria;
  nota?: number;
  periodo?: string; // ejemplo: "2026 B"
}