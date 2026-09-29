import { describe, it, expect, beforeAll, beforeEach } from "vitest";

let useMalla: typeof import("./useMalla").useMalla;

beforeAll(async () => {
  const mem = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    },
  });
  ({ useMalla } = await import("./useMalla"));
});

beforeEach(() => {
  useMalla.getState().reiniciar();
  for (const p of Object.keys(useMalla.getState().iraPeriodos)) useMalla.getState().borrarIra(p);
});

describe("useMalla", () => {
  it("setEstado guarda y 'pendiente' borra la clave", () => {
    useMalla.getState().setEstado("MATD113", "aprobada");
    expect(useMalla.getState().estados.MATD113).toBe("aprobada");
    useMalla.getState().setEstado("MATD113", "pendiente");
    expect("MATD113" in useMalla.getState().estados).toBe(false);
  });
  it("marcarCursando no pisa materias ya aprobadas", () => {
    useMalla.getState().setEstado("MATD113", "aprobada");
    useMalla.getState().marcarCursando(["MATD113", "MATD123"]);
    expect(useMalla.getState().estados).toEqual({ MATD113: "aprobada", MATD123: "cursando" });
  });
  it("cargarAvance marca materias y requisitos", () => {
    useMalla.getState().cargarAvance(["MATD113"], ["DEPD110"]);
    expect(useMalla.getState().estados.MATD113).toBe("aprobada");
    expect(useMalla.getState().requisitos.DEPD110).toBe(true);
  });
  it("reiniciar conserva el historial de IRA", () => {
    useMalla.getState().setIra("2026-A", 26.6);
    useMalla.getState().reiniciar();
    expect(useMalla.getState().iraPeriodos["2026-A"]).toBe(26.6);
  });
  it("exportar e importar dan el mismo avance", () => {
    useMalla.getState().setEstado("MATD113", "aprobada");
    useMalla.getState().setIra("2026-A", 26.6);
    const copia = JSON.parse(JSON.stringify(useMalla.getState().exportar()));
    useMalla.getState().reiniciar();
    expect(useMalla.getState().importar(copia)).toBe(true);
    expect(useMalla.getState().estados.MATD113).toBe("aprobada");
  });
  it("importar rechaza archivos inválidos sin tocar el estado", () => {
    useMalla.getState().setEstado("MATD113", "aprobada");
    expect(useMalla.getState().importar({ foo: 1 })).toBe(false);
    expect(useMalla.getState().estados.MATD113).toBe("aprobada");
  });
});

describe("notas por bimestre", () => {
  it("setNota guarda cada bimestre por separado", () => {
    useMalla.getState().setNota("MATD113", "b1", 18);
    useMalla.getState().setNota("MATD113", "b2", 19);
    expect(useMalla.getState().notas.MATD113).toEqual({ b1: 18, b2: 19 });
  });
  it("exportar e importar conservan las notas", () => {
    useMalla.getState().setNota("MATD113", "b1", 15);
    const copia = JSON.parse(JSON.stringify(useMalla.getState().exportar()));
    useMalla.getState().reiniciar();
    useMalla.getState().importar(copia);
    expect(useMalla.getState().notas.MATD113.b1).toBe(15);
  });
});
