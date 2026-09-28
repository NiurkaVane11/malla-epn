export type EstadoMateria = "pendiente" | "cursando" | "aprobada" | "reprobada";

export interface Materia {
  id: string;
  nombre: string;
  creditos: number;
  nivel: number; // 1 a 9
  piso: number; // créditos aprobados mínimos para inscribirla (PDF "Pisos 2026 B")
  prerrequisitos: string[]; // ids de materias
  correquisitos: string[]; // ids de materias que se toman a la vez
}

// Una materia puede tener varios registros (ej: reprobada y luego aprobada)
export interface Registro {
  materiaId: string;
  estado: EstadoMateria;
  nota?: number; // sobre 40
  periodo?: string; // ejemplo: "2026 B"
}