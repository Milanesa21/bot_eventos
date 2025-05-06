const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowPrincipal = require("./flowPrincipal");

const flowConsulta = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "👨‍🍳 Has solicitado consultar con el chef.",
    "Nuestro equipo te contactará a la brevedad.",
    "",
    "Para volver al menú principal escribe: *Angelica Perniles*",
    "Cualquier otro mensaje será ignorado hasta que escribas las palabras clave.",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const texto = ctx.body.trim().toLowerCase().replace(/\s+/g, " ");

    if (texto === "angelica perniles") {
      return gotoFlow(require("./flowPrincipal"));
    }

    // No envía ninguna respuesta para otros mensajes
    return fallBack();
  });

module.exports = flowConsulta;
