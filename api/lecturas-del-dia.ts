const SOURCE_URL = "https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/";

const decodeHtml = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Ntilde;/g, "Ñ");

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

const createSection = (titulo: string, lines: string[]) => {
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
  `La Palabra de hoy nos invita a volver el corazón a Cristo y a dejar que su voz ordene nuestras preocupaciones. ${frase ? `Cuando escuchamos: "${frase}",` : "Cuando escuchamos el Evangelio,"} el Señor nos recuerda que la fe no es una idea lejana, sino una confianza concreta para vivir este día con esperanza, sobriedad y amor.`;

const createOracionFinal = () =>
  "Señor Jesús, haz que tu palabra transforme mi vida. Enséñame a escucharte con humildad, a confiar en tu presencia y a llevar tu luz a quienes encuentre hoy. Amén.";

// (Revertido) Sin generación IA

interface ApiResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
}

export default async function handler(_req: unknown, res: ApiResponse) {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        "user-agent": "La Voz de Jesus PWA",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: "No se pudieron cargar las lecturas del día",
      });
      return;
    }

    const lines = htmlToLines(await response.text());
    const frase =
      lines
        .find((line) => line.startsWith("“") && line.endsWith("”"))
        ?.replace(/[“”]/g, "")
        .trim() ?? "";

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

    res.status(200).json({
      fecha: getFecha(lines),
      frase,
      primeraLectura: createSection(
        "Primera Lectura",
        getBetween(lines, /^Primera lectura$/i, [/^Salmo de hoy$/i]),
      ),
      salmo: createSection(
        "Salmo Responsorial",
        getBetween(lines, /^Salmo de hoy$/i, [/^Evangelio del día$/i]),
      ),
      evangelio: createSection(
        "Evangelio",
        getBetween(lines, /^Evangelio del día$/i, [
          /^Reciba el Evangelio/i,
          /^Evangelio de hoy en vídeo$/i,
          /^Reflexión del Evangelio/i,
        ]),
      ),
      reflexionLvj: createReflexionLvj(frase),
      oracionFinal: createOracionFinal(),
      audioDisponible: false,
    });
  } catch (error) {
    res.status(500).json({
      error: String(error),
    });
  }
}
