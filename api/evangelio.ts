// api/evangelio.ts

export default async function handler(req: any, res: any) {
  try {
    const response = await fetch(
      "https://www.cec.org.co/categorias-articulos/evangelio-diario"
    );

    const html = await response.text();

    res.status(200).json({
      success: true,
      length: html.length,
      preview: html.substring(0, 500)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error)
    });
  }
}