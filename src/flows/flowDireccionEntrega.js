// flows/flowDireccionEntrega.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual } = require("../utils/resetPedido");

const flowDireccionEntrega = addKeyword(EVENTS.ACTION).addAnswer(
  "🏠 Dirección de entrega.",
  { capture: true },
  async (ctx, { gotoFlow }) => {
    pedidoActual.customerData.address = ctx.body.trim();
    return gotoFlow(require("./flowComentarios"));
  }
);

module.exports = flowDireccionEntrega;
