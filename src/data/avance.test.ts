import { describe, it, expect } from "vitest";
import { MATERIAS } from "./malla";
import { AVANCE_APROBADAS } from "./avance";
import { REQUISITOS, REQUISITOS_CUMPLIDOS } from "./requisitos";
import { creditosDe, incumplidas } from "../lib/disponibles";
import type { Estados } from "../lib/disponibles";

describe("avance y requisitos", () => {
  const estados: Estados = Object.fromEntries(AVANCE_APROBADAS.map((id) => [id, "aprobada"]));
  it("todas las materias del avance existen", () => {
    const ids = new Set(MATERIAS.map((m) => m.id));
    for (const id of AVANCE_APROBADAS) expect(ids.has(id)).toBe(true);
  });
  it("el avance suma 66 créditos, igual que el currículum", () => {
    expect(creditosDe(MATERIAS, estados, "aprobada")).toBe(66);
  });
  it("el avance es coherente con los prerrequisitos", () => {
    expect(incumplidas(MATERIAS, estados)).toEqual([]);
  });
  it("los requisitos cumplidos existen y no hay ids repetidos", () => {
    const ids = REQUISITOS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of REQUISITOS_CUMPLIDOS) expect(ids).toContain(id);
  });
});
