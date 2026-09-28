import { describe, it, expect } from "vitest";
import { validarRespaldo } from "./respaldo";

const ok = { version: 1, estados: { MATD113: "aprobada" }, requisitos: { DEPD110: true }, iraPeriodos: { "2026-A": 26.6 } };

describe("validarRespaldo", () => {
  it("acepta un respaldo válido", () => expect(validarRespaldo(ok)).not.toBeNull());
  it("rechaza basura", () => {
    expect(validarRespaldo(null)).toBeNull();
    expect(validarRespaldo("hola")).toBeNull();
    expect(validarRespaldo({ ...ok, version: 2 })).toBeNull();
    expect(validarRespaldo({ ...ok, estados: { X: "volando" } })).toBeNull();
    expect(validarRespaldo({ ...ok, iraPeriodos: { "2026-A": "alto" } })).toBeNull();
    expect(validarRespaldo({ ...ok, requisitos: { X: "si" } })).toBeNull();
  });
});
