// flows/flowComentarios.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowConfirmacion = require("./flowConfirmacion");
const flowPrincipal = require("./flowPrincipal");

const flowComentarios = addKeyword(EVENTS.ACTION).addAnswer(
  "✏️ ¿Algún comentario o instrucción especial para tu pedido? (Ej: 'Sin picante', 'Sin sal')\nSi no tienes comentarios, escribe 'No' o 'Ninguno'.\n\n0️⃣ Escribe '0' para cancelar el pedido",
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state }) => {
    const text = ctx.body.trim();

    if (text === "0") {
      await resetPedido(state); // VERIFICADO/CORREGIDO: await presente
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    const pedidoActual = await getPedidoActual(state);
    const commentsToSave =
      text.toLowerCase() === "no" ||
      text.toLowerCase() === "ninguno" ||
      text.toLowerCase() === "ningun"
        ? null
        : text;

    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: {
          ...pedidoActual.customerData,
          comments: commentsToSave,
        },
      },
    });

    if (!commentsToSave) {
      await flowDynamic("📝 No se agregaron comentarios adicionales.");
    } else {
      await flowDynamic(
        [
          "📝 Comentarios guardados:",
          `"${text}"`,
          "Serán considerados al preparar tu pedido",
        ].join("\n")
      );
    }

    return gotoFlow(flowConfirmacion);
  }
);

module.exports = flowComentarios;
