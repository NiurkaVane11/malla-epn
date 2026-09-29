export type Etiqueta = { sigla: string; nombre: string; bg: string; texto: string };

// Cortes inferidos de tu propio currículum (EQUIV). Confírmalos si sacas una nota alta:
// tus "B" llegan hasta 31.83 y tus "MB" empiezan en 32.68.
const TABLA: { min: number; etq: Etiqueta }[] = [
  { min: 39, etq: { sigla: "EXC.H", nombre: "Excelente con honores", bg: "#DBE64C", texto: "#001F3F" } },
  { min: 36, etq: { sigla: "EXC", nombre: "Excelente", bg: "#DBE64C", texto: "#001F3F" } },
  { min: 32, etq: { sigla: "MB", nombre: "Muy bueno", bg: "#74C365", texto: "#001F3F" } },
  { min: 24, etq: { sigla: "B", nombre: "Bueno", bg: "#F6F7ED", texto: "#001F3F" } },
  { min: -Infinity, etq: { sigla: "F", nombre: "Fallido", bg: "#fecaca", texto: "#7f1d1d" } },
];

export function etiquetaDe(nota: number): Etiqueta {
  return (TABLA.find((t) => nota >= t.min) ?? TABLA[TABLA.length - 1]).etq;
}
