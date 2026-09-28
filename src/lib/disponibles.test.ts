import { describe, it, expect } from "vitest";
import { MATERIAS } from "../data/malla";
import { disponibles, puedeTomar, correquisitosFaltantes } from "./disponibles";

const get = (id: string) => MATERIAS.find((m) => m.id === id)!;

describe("disponibles", () => {
  it("al inicio solo están las materias sin prerrequisitos", () => {
    const ids = disponibles(MATERIAS, {}).map((m) => m.id);
    expect(ids).toContain("MATD113");
    expect(ids).not.toContain("ICCD244");
  });
  it("aprobar Programación I habilita Programación II", () => {
    expect(puedeTomar(get("ICCD244"), {})).toBe(false);
    expect(puedeTomar(get("ICCD244"), { ICCD144: "aprobada" })).toBe(true);
  });
  it("cursando no cuenta como prerrequisito cumplido", () => {
    expect(puedeTomar(get("ICCD244"), { ICCD144: "cursando" })).toBe(false);
  });
  it("avisa los correquisitos que faltan", () => {
    expect(correquisitosFaltantes(get("ISWD453"), {})).toEqual(["ISWD414", "ISWD433"]);
    expect(correquisitosFaltantes(get("ISWD453"), { ISWD414: "cursando", ISWD433: "cursando" })).toEqual([]);
  });
});
