const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowConsulta = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "👨‍🍳 Has solicitado consultar con el chef.",
    "Nuestro chef te contactará a la brevedad.",
    "",
    "Cuando quieras volver al menú escribe *Angelica Perniles*",
    "El bot con cada mensaje que mandes, se enviara un punto como respuesta, esta respuesta no es de parte del chef, y le pedimos por favor que lo ignore,"
  ])
  .addAnswer(
    ".", // Usamos un mensaje vacío en lugar de null
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const texto = ctx.body.trim().toLowerCase();
      if (texto === "angelica perniles") {
        return gotoFlow(require("./flowPrincipal"));
      }
      // Si no es el mensaje clave, hacemos fallBack al mismo mensaje
      return fallBack();
    }
  );

module.exports = flowConsulta;