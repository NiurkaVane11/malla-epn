import type { Materia } from "../types/malla";

export type Estado = "pendiente" | "cursando" | "aprobada";
export type Estados = Record<string, Estado>;

export const estadoDe = (e: Estados, id: string): Estado => e[id] ?? "pendiente";

export function creditosDe(materias: Materia[], e: Estados, estado: Estado, nivel?: number): number {
  return materias
    .filter((m) => (nivel ? m.nivel === nivel : true) && estadoDe(e, m.id) === estado)
    .reduce((s, m) => s + m.creditos, 0);
}

export function prerrequisitosFaltantes(m: Materia, e: Estados): string[] {
  return m.prerrequisitos.filter((id) => estadoDe(e, id) !== "aprobada");
}

// creditosAprobados: si se pasa, también se exige el piso del nivel.
export function puedeTomar(m: Materia, e: Estados, creditosAprobados?: number): boolean {
  if (prerrequisitosFaltantes(m, e).length > 0) return false;
  return creditosAprobados === undefined || creditosAprobados >= m.piso;
}

export function motivoBloqueo(m: Materia, e: Estados, creditosAprobados?: number): string | null {
  const f = prerrequisitosFaltantes(m, e);
  if (f.length) return `Falta aprobar: ${f.join(", ")}`;
  if (creditosAprobados !== undefined && creditosAprobados < m.piso)
    return `Piso: necesitas ${m.piso} créditos aprobados (tienes ${creditosAprobados})`;
  return null;
}

// Aviso, no bloqueo: ISWD414 e ISWD453 son correquisitos entre sí.
export function correquisitosFaltantes(m: Materia, e: Estados): string[] {
  return m.correquisitos.filter((id) => estadoDe(e, id) === "pendiente");
}

export function disponibles(materias: Materia[], e: Estados, usarPisos = false): Materia[] {
  const cred = usarPisos ? creditosDe(materias, e, "aprobada") : undefined;
  return materias.filter((m) => estadoDe(e, m.id) === "pendiente" && puedeTomar(m, e, cred));
}

// Materias que dependen (directa o indirectamente) de `id` por prerrequisito.
export function dependientes(materias: Materia[], id: string): string[] {
  const out = new Set<string>();
  const cola = [id];
  while (cola.length) {
    const actual = cola.pop()!;
    for (const m of materias) {
      if (m.prerrequisitos.includes(actual) && !out.has(m.id)) {
        out.add(m.id);
        cola.push(m.id);
      }
    }
  }
  return [...out];
}

// Materias aprobadas o cursando cuyos prerrequisitos ya no están aprobados.
export function incumplidas(materias: Materia[], e: Estados): string[] {
  return materias
    .filter((m) => estadoDe(e, m.id) !== "pendiente" && prerrequisitosFaltantes(m, e).length > 0)
    .map((m) => m.id);
}
