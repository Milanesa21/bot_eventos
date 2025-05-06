// flows/flowPago.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowPago = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { flowDynamic }) => {
    const lines = [
      "💳 *Métodos de Pago Disponibles:*",
      "",
      "1️⃣ Transferencia Bancaria",
      "2️⃣ Pagos en efectivo",
      "",
      "Por favor, selecciona una opción (solo ingresa el número):",
    ];
    await flowDynamic(lines.join("\n"));
  })
  .addAnswer(
    { patterns: ["1", "2"] },
    { capture: true },
    async (ctx, { flowDynamic, endFlow, fallBack }) => {
      const choice = ctx.body.trim();

      let detalle = "";
      if (choice === "1") {
        detalle =
          "🏦 *Transferencia Bancaria*\n" +
          "Nombre del titular: Viviana Noemí Arias\n" +
          "CUIL: 27-32519381-1\n" +
          "N° de cuenta (CA $): 17902623701432\n" +
          "Alias: ANGELICAPERNILES3\n" +
          "CBU: 0110262030026237014329\n";
      } else if (choice === "2") {
        detalle =
          "💰 *Pago en Efectivo*\n" +
          "Nuestro chef se pondrá en contacto contigo para coordinar:\n" +
          "→ Lugar y hora de pago\n" +
          "→ Entrega del efectivo\n" +
          "→ Recibo correspondiente";
      } else {
        await flowDynamic("❌ Opción no válida. Por favor selecciona 1 o 2.");
        return fallBack();
      }

      await flowDynamic(
        [
          `✅ Gracias por seleccionar la opción ${choice}`,
          detalle,
          "",
          "¡Tu pedido está siendo procesado!",
          "Muchas gracias por confiar en *Angélica Perniles* 🐷",
        ].join("\n")
      );
    }
  );

module.exports = flowPago;
