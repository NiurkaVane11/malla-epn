import { describe, it, expect } from "vitest";
import { calcularIRA, notaNecesaria } from "./ira";
import type { Materia, Registro } from "../types/malla";

const mat = (id: string, creditos: number): Materia => ({
  id, nombre: id, creditos, nivel: 1, piso: 0, prerrequisitos: [], correquisitos: [],
});
const materias = [mat("FIS", 4), mat("CAL", 4), mat("PRO", 4)];
const registros: Registro[] = [
  { materiaId: "FIS", estado: "aprobada", nota: 32 },
  { materiaId: "CAL", estado: "reprobada", nota: 20 },
  { materiaId: "PRO", estado: "aprobada", nota: 36 },
  { materiaId: "CAL", estado: "aprobada", nota: 30 },
];

describe("IRA", () => {
  it("coincide con el ejemplo: 24.5", () => {
    const r = calcularIRA(registros, materias);
    expect(r.creditosAprobados).toBe(12);
    expect(r.creditosInscritos).toBe(16);
    expect(r.ira).toBeCloseTo(24.5, 5);
  });

  it("nota necesaria con 8 créditos nuevos para llegar a 27", () => {
    const r = calcularIRA(registros, materias);
    expect(notaNecesaria(r, 8, 27)).toBeCloseTo(32, 5);
  });
});