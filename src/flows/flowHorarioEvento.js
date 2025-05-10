// flows/flowHorarioEvento.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowHorarioEvento = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "⏰ *Ingresa el horario del evento:*",
    "Puedes usar cualquier formato:",
    "→ 20:30 hs",
    "→ 9 de la noche",
    "→ mediodía",
    "→ 15hs",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const input = ctx.body.trim();

    if (input === "0") {
      await resetPedido(state); // CORREGIDO: Añadido await
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    // Actualizar estado con el horario
    const pedidoActual = await getPedidoActual(state); // CORREGIDO: Añadido await
    await state.update({
      pedidoActual: {
        ...pedidoActual, // pedidoActual es ahora el objeto resuelto
        customerData: {
          ...pedidoActual.customerData,
          time: input,
        },
      },
    });

    await flowDynamic(
      [
        "✅ Horario registrado:",
        `⏰ *${input}*`,
        "",
        "Ahora necesitamos tu dirección de entrega...",
      ].join("\n")
    );

    return gotoFlow(require("./flowDireccionEntrega"));
  }
);

module.exports = flowHorarioEvento;
