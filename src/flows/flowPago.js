// flows/flowPago.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowPago = addKeyword(EVENTS.ACTION)
  // 1) Mostrar métodos de pago
  .addAction(async (_, { flowDynamic }) => {
    const lines = [
      "💳 *Métodos de Pago Disponibles:*",
      "",
      "1️⃣ Transferencia Bancaria",
      "2️⃣ (Opción futura: Mercado Pago)",
      "",
      "Por favor, selecciona una opción (solo ingresa el número):",
    ];
    await flowDynamic(lines.join("\n"));
  })
  // 2) Capturar la selección del cliente
  .addAnswer(
    { patterns: ["1", "2", "3"] },
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
        detalle = "📲 *Mercado Pago*\n(link o instrucciones aquí)";
      } else {
        await flowDynamic("❌ No entendí tu selección.");
        return fallBack();
      }

      await flowDynamic(
        `👍 *Has seleccionado la opción ${choice}*\n\n` +
          detalle +
          "\nMuchas gracias por tu preferencia. Estaremos esperando tu pago para empezar a trabajar en tu pedido."
      );
      return 
    }
  );

module.exports = flowPago;
