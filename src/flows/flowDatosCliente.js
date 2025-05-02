// flows/flowDatosCliente.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual, resetPedido } = require("../utils/resetPedido");

const flowDatosCliente = addKeyword(EVENTS.ACTION).addAnswer(
  "📇 Por favor, escribe tu *número de teléfono* (con código de área). 0️⃣ Cancelar Pedido",
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    const text = ctx.body.trim();
    if (text === "0") {
      resetPedido();
      await flowDynamic(
        '❌ Pedido cancelado. Para empezar de nuevo escribe "menu".'
      );
      return gotoFlow(require("./flowPrincipal"));
    }
    pedidoActual.customerData.phone = text;
    return gotoFlow(require("./flowFechaEvento"));
  }
);

module.exports = flowDatosCliente;
