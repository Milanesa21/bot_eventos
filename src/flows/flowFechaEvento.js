// flows/flowFechaEvento.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowFechaEvento = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📅 *Ingresa la fecha del evento en cualquier formato:*",
    "Ejemplos:",
    "→ 25 de diciembre 2024",
    "→ 5/8/25",
    "→ proximo viernes",
    "→ 15 de abril",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const input = ctx.body.trim();

    // Manejar cancelación
    if (input === "0") {
      resetPedido(state);
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    // Actualizar estado con la fecha literal
    const pedidoActual = getPedidoActual(state);
    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: {
          ...pedidoActual.customerData,
          date: input,
        },
      },
    });

    // Confirmación simple
    await flowDynamic(
      [
        "✅ Fecha registrada:",
        `📅 *${input}*`,
        "",
        "Ahora necesitamos tu dirección de entrega...",
      ].join("\n")
    );

    return gotoFlow(require("./flowDireccionEntrega"));
  }
);

module.exports = flowFechaEvento;
