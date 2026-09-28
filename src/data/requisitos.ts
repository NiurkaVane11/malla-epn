export type Requisito = { id: string; nombre: string; nota?: string };

// Requisitos de graduación: no suman a los 135 créditos.
export const REQUISITOS: Requisito[] = [
  { id: "IEXD200", nombre: "Nivel de suficiencia B1 en inglés" },
  { id: "DEPD110", nombre: "Deportes" },
  { id: "SOCD210", nombre: "Clubes" },
  { id: "CSHD500", nombre: "Asignatura de Comunicación" },
  { id: "ADMD700", nombre: "Emprendimiento" },
  { id: "ADMD800", nombre: "Formulación y Evaluación de Proyectos", nota: "Correquisito de TITD104" },
  { id: "AMBD900", nombre: "Ecología y Ambiente" },
];

// Los que ya cumples según tu currículum.
export const REQUISITOS_CUMPLIDOS = ["IEXD200", "DEPD110", "SOCD210", "CSHD500", "ADMD700"];
