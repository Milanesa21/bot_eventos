// flows/flowFechaEvento.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual } = require("../utils/resetPedido");

const flowFechaEvento = addKeyword(EVENTS.ACTION).addAnswer(
  "📅 Fecha del evento (DD/MM/AAAA).",
  { capture: true },
  async (ctx, { gotoFlow }) => {
    pedidoActual.customerData.date = ctx.body.trim();
    return gotoFlow(require("./flowDireccionEntrega"));
  }
);

module.exports = flowFechaEvento;
