type Props = { aprobados: number; cursando: number; total: number };

export default function ProgresoCarrera({ aprobados, cursando, total }: Props) {
  const pa = (aprobados / total) * 100;
  const pc = (cursando / total) * 100;
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Avance de la carrera
          </p>
          <p className="text-4xl font-bold text-slate-900">{pa.toFixed(1)}%</p>
        </div>
        <p className="text-sm text-slate-600">
          {aprobados} / {total} créditos
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={aprobados}
        className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pa}%` }} />
        <div className="h-full bg-amber-400 transition-all" style={{ width: `${pc}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Aprobados: {aprobados}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Cursando: {cursando}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Faltan: {total - aprobados - cursando}
        </span>
      </div>
    </section>
  );
}
