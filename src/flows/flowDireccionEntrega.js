// flows/flowDireccionEntrega.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowComentarios = require("./flowComentarios");
const flowPrincipal = require("./flowPrincipal");

const flowDireccionEntrega = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🏠 *Ingresa la dirección donde deseas recibir tu pedido:*",
    "Puedes escribirla en el formato que prefieras",
    "Ejemplo: 'Calle Principal 123 Barrio 12345'",
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

    if (input.length < 5) {
      // Validación básica
      await flowDynamic(
        "❌ Dirección demasiado corta. Por favor, sé más específico."
      );
      return fallBack();
    }

    const pedidoActual = await getPedidoActual(state);
    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: {
          ...pedidoActual.customerData,
          address: input,
        },
      },
    });

    await flowDynamic(
      [
        "✅ Dirección guardada:",
        `📍 ${input}`,
        "Continuamos con los comentarios adicionales...",
      ].join("\n")
    );

    return gotoFlow(flowComentarios);
  }
);

module.exports = flowDireccionEntrega;
