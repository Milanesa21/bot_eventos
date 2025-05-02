const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual, resetPedido } = require("../utils/resetPedido");

const flowComentarios = addKeyword(EVENTS.ACTION).addAnswer(
  "✏️ Comentarios o instrucciones especiales. 0️⃣ Cancelar Pedido",
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    const text = ctx.body.trim();
    if (text === "0") {
      resetPedido();
      await flowDynamic(
        '❌ Pedido cancelado. Para empezar de nuevo escribe "Hola".'
      );
      return gotoFlow(require("./flowPrincipal"));
    }
    pedidoActual.customerData.comments = text;
    // Usar require aquí para evitar importación circular
    return gotoFlow(require("./flowConfirmacion"));
  }
);

module.exports = flowComentarios;
