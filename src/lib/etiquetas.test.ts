import { describe, it, expect } from "vitest";
import { etiquetaDe } from "./etiquetas";

describe("etiquetaDe", () => {
  it("clasifica tus notas reales", () => {
    expect(etiquetaDe(20)).toMatchObject({ sigla: "F" });
    expect(etiquetaDe(28.4)).toMatchObject({ sigla: "B" });
    expect(etiquetaDe(31.83)).toMatchObject({ sigla: "B" });
    expect(etiquetaDe(32.68)).toMatchObject({ sigla: "MB" });
    expect(etiquetaDe(35.4)).toMatchObject({ sigla: "MB" });
  });
  it("no falla en los bordes", () => {
    expect(etiquetaDe(0)).toMatchObject({ sigla: "F" });
    expect(etiquetaDe(40)).toMatchObject({ sigla: "EXC.H" });
  });
});
