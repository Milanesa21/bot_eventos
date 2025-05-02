// flows/flowAgregarItems.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowAgregarItems = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "✅ *Producto agregado.*",
    "",
    "¿Deseas agregar más productos?",
    "1️⃣ Sí, volver al menú principal",
    "2️⃣ No, continuar con mi pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    const opt = ctx.body.trim();
    if (opt === "1") {
      return gotoFlow(require("./flowPrincipal"));
    }
    if (opt === "2") {
      return gotoFlow(require("./flowDatosCliente"));
    }
    await flowDynamic("❌ Por favor responde con 1 o 2.");
    return gotoFlow(module.exports);
  }
);

module.exports = flowAgregarItems;
