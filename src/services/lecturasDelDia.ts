export interface LecturaSeccion {
  titulo: string;
  referencia?: string;
  texto: string;
}

export interface LecturasDelDiaData {
  fecha: string;
  frase: string;
  primeraLectura: LecturaSeccion;
  salmo: LecturaSeccion;
  evangelio: LecturaSeccion;
  reflexionLvj: string;
  oracionFinal: string;
  audioDisponible: boolean;
}

const SOURCE_URL = "https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/";

const decodeHtml = (value: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const cleanText = (value: string) =>
  decodeHtml(value)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const htmlToLines = (html: string) => {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(h1|h2|h3|h4|p|div|li|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  return cleanText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const findLineIndex = (lines: string[], pattern: RegExp) =>
  lines.findIndex((line) => pattern.test(line));

const getBetween = (
  lines: string[],
  startPattern: RegExp,
  endPatterns: RegExp[],
) => {
  const start = findLineIndex(lines, startPattern);

  if (start === -1) return [];

  const end = lines.findIndex(
    (line, index) =>
      index > start && endPatterns.some((pattern) => pattern.test(line)),
  );

  return lines.slice(start + 1, end === -1 ? undefined : end);
};

const createSection = (titulo: string, lines: string[]): LecturaSeccion => {
  const referencia = lines[0] ?? "";
  const texto = lines.slice(1).join("\n\n");

  return {
    titulo,
    referencia,
    texto: texto || referencia,
  };
};

const getFecha = (lines: string[]) => {
  const yearIndex = lines.findIndex((line) => /^\d{4}$/.test(line));
  const day = lines[yearIndex - 2];
  const month = lines[yearIndex - 1];
  const year = lines[yearIndex];

  if (day && month && year) {
    return `${day} de ${month.toLowerCase()} de ${year}`;
  }

  return new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const createReflexionLvj = (frase: string) =>
  `La Palabra de hoy nos invita a volver el corazon a Cristo y a dejar que su voz ordene nuestras preocupaciones. ${frase ? `Cuando escuchamos: "${frase}",` : "Cuando escuchamos el Evangelio,"} el Senor nos recuerda que la fe no es una idea lejana, sino una confianza concreta para vivir este dia con esperanza, sobriedad y amor.`;

const createOracionFinal = () =>
  "Senor Jesus, haz que tu palabra transforme mi vida. Ensename a escucharte con humildad, a confiar en tu presencia y a llevar tu luz a quienes encuentre hoy. Amen.";

export const parseDominicosLecturas = (html: string): LecturasDelDiaData => {
  const lines = htmlToLines(html);
  const frase =
    lines
      .find((line) => line.startsWith("“") && line.endsWith("”"))
      ?.replace(/[“”]/g, "")
      .trim() ?? "";

  const primeraLectura = createSection(
    "Primera Lectura",
    getBetween(lines, /^Primera lectura$/i, [/^Salmo de hoy$/i]),
  );
  const salmo = createSection(
    "Salmo Responsorial",
    getBetween(lines, /^Salmo de hoy$/i, [/^Evangelio del día$/i]),
  );
  const evangelio = createSection(
    "Evangelio",
    getBetween(lines, /^Evangelio del día$/i, [
      /^Reciba el Evangelio/i,
      /^Evangelio de hoy en vídeo$/i,
      /^Reflexión del Evangelio/i,
    ]),
  );

  return {
    fecha: getFecha(lines),
    frase,
    primeraLectura,
    salmo,
    evangelio,
    reflexionLvj: createReflexionLvj(frase),
    oracionFinal: createOracionFinal(),
    audioDisponible: false,
  };
};

export async function getLecturasDelDia(): Promise<LecturasDelDiaData> {
  try {
    const apiResponse = await fetch("/api/lecturas-del-dia");
    const contentType = apiResponse.headers.get("content-type") ?? "";

    if (apiResponse.ok && contentType.includes("application/json")) {
      return apiResponse.json();
    }
  } catch {
    // En desarrollo con Vite puede no existir la funcion serverless.
  }

  const sourceResponse = await fetch("/dominicos-hoy");

  if (!sourceResponse.ok) {
    throw new Error("No se pudieron cargar las lecturas del dia");
  }

  return parseDominicosLecturas(await sourceResponse.text());
}

export { SOURCE_URL };

