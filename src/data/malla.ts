import type { Materia } from "../types/malla";

const m = (
  id: string,
  nombre: string,
  creditos: number,
  nivel: number,
  piso: number,
  prerrequisitos: string[] = [],
  correquisitos: string[] = []
): Materia => ({ id, nombre, creditos, nivel, piso, prerrequisitos, correquisitos });

export const MATERIAS: Materia[] = [
  // Nivel 1
  m("MATD113", "Álgebra Lineal", 3, 1, 0),
  m("MATD123", "Cálculo en una Variable", 3, 1, 0),
  m("FISD134", "Mecánica Newtoniana", 4, 1, 0),
  m("ICCD144", "Programación I", 4, 1, 0),
  m("CSHD111", "Comunicación Oral y Escrita", 1, 1, 0),
  // Nivel 2
  m("MATD213", "Ecuaciones Diferenciales Ordinarias", 3, 2, 8, ["MATD113", "MATD123"]),
  m("ICCD224", "Matemáticas Computacionales y Teoría de la Computación", 4, 2, 8, ["MATD113"]), // ? revisar
  m("ICCD233", "Fundamentos de Electrónica para Computación", 3, 2, 8),
  m("ICCD244", "Programación II", 4, 2, 8, ["ICCD144"]),
  m("CSHD211", "Análisis Socioeconómico y Político del Ecuador", 1, 2, 8),
  // Nivel 3
  m("MATD223", "Probabilidad y Estadísticas Básicas", 3, 3, 22, ["MATD123"]),
  m("ICCD323", "Sistemas Operativos", 3, 3, 22), // ? no pude seguir la flecha
  m("ICCD332", "Arquitectura de Computadores", 2, 3, 22),
  m("ICCD343", "Estructura de Datos y Algoritmos I", 3, 3, 22, ["ICCD244"]),
  m("ICCD353", "Fundamentos de Redes y Conectividad", 3, 3, 22, ["ICCD233"]),
  m("CSHD300", "Asignatura de Artes y Humanidades", 1, 3, 22),
  // Nivel 4
  m("ISWD414", "Ingeniería de Software y de Requerimientos", 4, 4, 37, ["ICCD343"], ["ISWD453"]),
  m("ICCD422", "Compiladores y Lenguajes", 2, 4, 37, ["ICCD343", "ICCD224"]),
  m("ISWD433", "Fundamentos de Sistemas de Información", 3, 4, 37, [], ["ISWD453"]),
  m("ICCD442", "Estructura de Datos y Algoritmos II", 2, 4, 37, ["ICCD343"]),
  m("ISWD453", "Fundamentos de Bases de Datos", 3, 4, 37, [], ["ISWD414", "ISWD433"]),
  m("CSHD400", "Asignatura de Economía y Sociedad", 1, 4, 37),
  // Nivel 5
  m("ADMD511", "Gestión Organizacional", 1, 5, 52),
  m("ISWD523", "Diseño de Software", 3, 5, 52, ["ISWD414"]),
  m("ICCD533", "Computación Gráfica", 3, 5, 52, ["ICCD442"]),
  m("ISWD543", "Inteligencia Artificial y Aprendizaje Automático", 3, 5, 52, ["ICCD442"]),
  m("ISWD553", "Bases de Datos Distribuidas", 3, 5, 52, ["ISWD453"]),
  m("PSCD202", "Prácticas de Servicio Comunitario", 2, 5, 52),
  // Nivel 6
  m("ISWD613", "Aplicaciones Web", 3, 6, 67), // ? sin flecha de entrada
  m("ISWD622", "Metodologías Ágiles", 2, 6, 67, ["ISWD523"]),
  m("ISWD633", "Construcción y Evolución de Software", 3, 6, 67, ["ISWD523"]),
  m("ICCD643", "Tecnologías de Seguridad", 3, 6, 67, ["ICCD353"]),
  m("ISWD652", "Calidad de Software", 2, 6, 67, ["ISWD523"]),
  m("ADMD611", "Gestión de Procesos y Calidad", 1, 6, 67),
  m("ADMD711", "Ingeniería Financiera", 1, 6, 67),
  // Nivel 7
  m("ISWD713", "Aplicaciones Móviles", 3, 7, 82, ["ISWD613"]),
  m("ISWD723", "Interacción Humano Computador", 3, 7, 82, [], ["ISWD732"]),
  m("ISWD732", "Usabilidad y Accesibilidad", 2, 7, 82, [], ["ISWD723"]),
  m("ISWD743", "Business Intelligence", 3, 7, 82, ["ISWD553"]),
  m("ISWD752", "Verificación y Validación de Software", 2, 7, 82, ["ISWD652"]),
  m("ISWD762", "Automatización de Procesos", 2, 7, 82, ["ISWD414"]),
  // Nivel 8
  m("ISWD813", "Aplicaciones Web Avanzadas", 3, 8, 90, ["ISWD613"]),
  m("ISWD823", "Desarrollo de Juegos Interactivos", 3, 8, 90, ["ISWD723"]),
  m("ISWD833", "Auditoría Informática", 3, 8, 90, ["ICCD643"]),
  m("ICCD842", "Profesionalismo en Informática", 2, 8, 90),
  m("ISWD853", "Desarrollo de Software Seguro", 3, 8, 90, ["ISWD752"]),
  m("TITD104", "Diseño de Trabajo de Integración Curricular / Preparación Examen Complexivo", 1, 8, 105),
  // Nivel 9
  m("ISWD913", "Sistemas Embebidos", 3, 9, 105, ["ICCD442"]),
  m("ISWD922", "Gestión de Proyectos de Software", 2, 9, 105, ["ISWD633"]),
  m("PRLD105", "Prácticas Laborales", 5, 9, 75),
  m("TITD201", "Trabajo de Integración Curricular / Examen Complexivo", 5, 9, 120, ["TITD104"]),
];