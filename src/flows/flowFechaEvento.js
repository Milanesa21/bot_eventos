// flows/flowFechaEvento.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowHorarioEvento = require("./flowHorarioEvento");
const flowPrincipal = require("./flowPrincipal");

const flowFechaEvento = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📅 *Ingresa la fecha del evento en cualquier formato:*",
    "Ejemplo:",
    "→ 25 de diciembre",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const input = ctx.body.trim();

    if (input === "0") {
      await resetPedido(state); // VERIFICADO/CORREGIDO: await presente
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    if (input.length < 3) {
      // Validación básica
      await flowDynamic("❌ Fecha demasiado corta. Intenta de nuevo.");
      return fallBack();
    }

    const pedidoActual = await getPedidoActual(state);
    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: {
          ...pedidoActual.customerData,
          date: input,
        },
      },
    });

    await flowDynamic(
      [
        "✅ Fecha registrada:",
        `📅 *${input}*`,
        "Ahora necesitamos el horario del evento...",
      ].join("\n")
    );

    return gotoFlow(flowHorarioEvento);
  }
);

module.exports = flowFechaEvento;
