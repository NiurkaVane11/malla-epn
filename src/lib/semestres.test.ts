import { describe, it, expect } from "vitest";
import { formatear, siguiente, anterior, periodoDeNivel } from "./semestres";

describe("semestres", () => {
  it("después de 2026 B viene 2027 A", () => {
    expect(formatear(siguiente({ anio: 2026, letra: "B" }))).toBe("2027 A");
  });
  it("antes de 2027 A viene 2026 B", () => {
    expect(formatear(anterior({ anio: 2027, letra: "A" }))).toBe("2026 B");
  });
  it("quinto nivel es 2026 B, sexto es 2027 A", () => {
    const actual = { anio: 2026, letra: "B" as const };
    expect(formatear(periodoDeNivel(6, 5, actual))).toBe("2027 A");
    expect(formatear(periodoDeNivel(4, 5, actual))).toBe("2026 A");
  });
});