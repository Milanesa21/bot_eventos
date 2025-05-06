// flows/flowComentarios.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowComentarios = addKeyword(EVENTS.ACTION).addAnswer(
  "✏️ ¿Algún comentario o instrucción especial para tu pedido? (Ej: 'Sin picante', 'Entregar en portería')",
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state }) => {
    const text = ctx.body.trim();

    // Manejo de cancelación
    if (text === "0") {
      resetPedido(state); // Pasamos state al reset
      await flowDynamic(
        [
          "❌ Pedido cancelado",
          "Tu carrito y datos han sido reiniciados",
          'Puedes empezar de nuevo escribiendo "Hola"',
        ].join("\n")
      );
      return gotoFlow(require("./flowPrincipal"));
    }

    // Actualizar comentarios en el estado
    const pedidoActual = getPedidoActual(state);
    const newCustomerData = {
      ...pedidoActual.customerData,
      comments: text,
    };

    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: newCustomerData,
      },
    });

    await flowDynamic(
      [
        "📝 Comentarios guardados:",
        `"${text}"`,
        "Serán considerados al preparar tu pedido",
      ].join("\n")
    );

    return gotoFlow(require("./flowConfirmacion"));
  }
);

module.exports = flowComentarios;
