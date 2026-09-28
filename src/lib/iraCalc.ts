export type Base = { promedio: number; aprobados: number; reprobados: number };
export type Cursada = { nota: number; creditos: number };

// Datos del currículum: promedio /40, créditos aprobados y reprobados.
export const BASE_INICIAL: Base = { promedio: 30.63, aprobados: 66, reprobados: 10 };

// Nota mínima para aprobar (sobre 40). Es coherente con tus datos, pero confírmala en tu reglamento.
export const MINIMO_APROBAR = 28;

// IRA = promedio ponderado × aprobados / (aprobados + reprobados)
export function calcularIra(b: Base): number {
  const total = b.aprobados + b.reprobados;
  return total === 0 ? 0 : (b.promedio * b.aprobados) / total;
}

// Añade materias cursadas: las aprobadas entran al promedio, las reprobadas suman a "reprobados".
export function proyectar(base: Base, cursadas: Cursada[], minimo = MINIMO_APROBAR): Base {
  let suma = base.promedio * base.aprobados;
  let ap = base.aprobados;
  let rep = base.reprobados;
  for (const c of cursadas) {
    if (c.nota >= minimo) {
      suma += c.nota * c.creditos;
      ap += c.creditos;
    } else {
      rep += c.creditos;
    }
  }
  return { promedio: ap ? suma / ap : 0, aprobados: ap, reprobados: rep };
}
