import type { Materia } from "../types/malla";

export type Estado = "pendiente" | "cursando" | "aprobada";
export type Estados = Record<string, Estado>;

export const estadoDe = (e: Estados, id: string): Estado => e[id] ?? "pendiente";

// Se puede tomar si todos los prerrequisitos están aprobados.
export function puedeTomar(m: Materia, e: Estados): boolean {
  return m.prerrequisitos.every((id) => estadoDe(e, id) === "aprobada");
}

// Correquisitos que aún no están aprobados ni cursándose.
// Se devuelven como aviso, no como bloqueo: ISWD414 e ISWD453 son
// correquisitos entre sí, y si bloqueara ninguna se podría empezar.
export function correquisitosFaltantes(m: Materia, e: Estados): string[] {
  return m.correquisitos.filter((id) => estadoDe(e, id) === "pendiente");
}

export function disponibles(materias: Materia[], e: Estados): Materia[] {
  return materias.filter((m) => estadoDe(e, m.id) === "pendiente" && puedeTomar(m, e));
}
