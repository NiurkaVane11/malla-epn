# Malla EPN

Malla curricular interactiva de Ingeniería de Software (EPN): estado de materias, prerrequisitos,
pisos por nivel, requisitos de graduación, IRA por período y calculadora de IRA.

## Uso
```bash
npm install
npm run dev      # http://localhost:3000
npx vitest run   # pruebas
```

Los datos se guardan en el navegador (localStorage). Usa Exportar/Importar para respaldarlos.

## Datos
- `src/data/malla.ts`: materias, créditos, pisos y requisitos.
- `src/data/avance.ts`: materias aprobadas según el currículum.
- `src/data/requisitos.ts`: requisitos de graduación.

Verifica prerrequisitos y pisos contra la malla oficial antes de confiar en la app.
