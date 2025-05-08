// flows/flowDireccionEntrega.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowDireccionEntrega = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🏠 *Ingresa la dirección donde deseas recibir tu pedido:*",
    "Puedes escribirla en el formato que prefieras",
    "Ejemplo: 'Calle Principal 123'",
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

    // Actualizar estado sin validaciones
    const pedidoActual = getPedidoActual(state);
    const newCustomerData = {
      ...pedidoActual.customerData,
      address: input,
    };

    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: newCustomerData,
      },
    });

    // Confirmación simple
    await flowDynamic(
      [
        "✅ Dirección guardada:",
        `📍 ${input}`,
        "",
        "Continuamos con los comentarios adicionales...",
      ].join("\n")
    );

    return gotoFlow(require("./flowComentarios"));
  }
);

module.exports = flowDireccionEntrega;
