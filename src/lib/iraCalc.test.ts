import { describe, it, expect } from "vitest";
import { BASE_INICIAL, calcularIra, proyectar } from "./iraCalc";

describe("iraCalc", () => {
  it("reproduce el IRA del currículum (26.60)", () => {
    expect(calcularIra(BASE_INICIAL)).toBeCloseTo(26.6, 2);
  });
  it("sin materias nuevas no cambia", () => {
    expect(calcularIra(proyectar(BASE_INICIAL, []))).toBeCloseTo(26.6, 2);
  });
  it("una materia reprobada baja el IRA y suma créditos reprobados", () => {
    const p = proyectar(BASE_INICIAL, [{ nota: 20, creditos: 3 }]);
    expect(p.reprobados).toBe(13);
    expect(p.aprobados).toBe(66);
    expect(calcularIra(p)).toBeLessThan(26.6);
  });
  it("una materia con buena nota sube el promedio y el IRA", () => {
    const p = proyectar(BASE_INICIAL, [{ nota: 38, creditos: 4 }]);
    expect(p.aprobados).toBe(70);
    expect(p.promedio).toBeGreaterThan(30.63);
    expect(calcularIra(p)).toBeGreaterThan(26.6);
  });
});
