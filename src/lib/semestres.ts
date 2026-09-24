export type Letra = "A" | "B";
export interface Periodo {
  anio: number;
  letra: Letra;
}

export const formatear = (p: Periodo): string => `${p.anio} ${p.letra}`;

export const siguiente = (p: Periodo): Periodo =>
  p.letra === "A"
    ? { anio: p.anio, letra: "B" }
    : { anio: p.anio + 1, letra: "A" };

export const anterior = (p: Periodo): Periodo =>
  p.letra === "B"
    ? { anio: p.anio, letra: "A" }
    : { anio: p.anio - 1, letra: "B" };

// Dado el nivel actual y su periodo, calcula el periodo de cualquier otro nivel
export function periodoDeNivel(
  nivel: number,
  nivelActual: number,
  periodoActual: Periodo
): Periodo {
  let p = periodoActual;
  const pasos = nivel - nivelActual;
  for (let i = 0; i < Math.abs(pasos); i++) {
    p = pasos > 0 ? siguiente(p) : anterior(p);
  }
  return p;
}