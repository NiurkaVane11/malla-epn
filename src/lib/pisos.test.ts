import { describe, it, expect } from "vitest";
import { MATERIAS } from "../data/malla";
import { dependientes, disponibles, incumplidas, motivoBloqueo, puedeTomar } from "./disponibles";

const get = (id: string) => MATERIAS.find((m) => m.id === id)!;

describe("pisos", () => {
  it("bloquea por piso aunque no haya prerrequisitos", () => {
    expect(puedeTomar(get("ISWD613"), {}, 66)).toBe(false);
    expect(puedeTomar(get("ISWD613"), {}, 67)).toBe(true);
  });
  it("sin créditos definidos, el piso se ignora", () => {
    expect(puedeTomar(get("ISWD613"), {})).toBe(true);
  });
  it("explica el motivo del bloqueo", () => {
    expect(motivoBloqueo(get("ISWD613"), {}, 66)).toContain("67");
    expect(motivoBloqueo(get("ICCD244"), {}, 100)).toContain("ICCD144");
    expect(motivoBloqueo(get("MATD113"), {}, 0)).toBeNull();
  });
  it("disponibles respeta el piso solo si se pide", () => {
    expect(disponibles(MATERIAS, {}, true).map((m) => m.id)).not.toContain("ISWD613");
    expect(disponibles(MATERIAS, {}, false).map((m) => m.id)).toContain("ISWD613");
  });
});

describe("cascada", () => {
  it("dependientes es transitivo", () => {
    const d = dependientes(MATERIAS, "ICCD343");
    expect(d).toContain("ISWD414");
    expect(d).toContain("ISWD523"); // ICCD343 → ISWD414 → ISWD523
    expect(d).not.toContain("MATD113");
  });
  it("detecta materias con prerrequisito sin aprobar", () => {
    expect(incumplidas(MATERIAS, { ICCD244: "aprobada" })).toEqual(["ICCD244"]);
    expect(incumplidas(MATERIAS, { ICCD244: "aprobada", ICCD144: "aprobada" })).toEqual([]);
  });
});
