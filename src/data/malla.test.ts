import { describe, it, expect } from "vitest";
import { MATERIAS } from "./malla";

describe("malla", () => {
  it("suma 135 créditos", () => {
    expect(MATERIAS.reduce((s, x) => s + x.creditos, 0)).toBe(135);
  });
  it("cada nivel tiene 15 créditos", () => {
    for (let n = 1; n <= 9; n++) {
      const c = MATERIAS.filter((x) => x.nivel === n).reduce((s, x) => s + x.creditos, 0);
      expect(c).toBe(15);
    }
  });
  it("los requisitos apuntan a materias que existen", () => {
    const ids = new Set(MATERIAS.map((x) => x.id));
    for (const x of MATERIAS)
      for (const r of [...x.prerrequisitos, ...x.correquisitos]) expect(ids.has(r)).toBe(true);
  });
});
