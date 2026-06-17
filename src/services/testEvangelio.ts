export const testEvangelio = async () => {
  try {
    const response = await fetch(
      "https://www.cec.org.co/categorias-articulos/evangelio-diario"
    );

    const html = await response.text();

    console.log("HTML recibido:", html.substring(0, 1000));

    return html;
  } catch (error) {
    console.error(error);
  }
};