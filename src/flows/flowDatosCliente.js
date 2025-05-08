// flows/flowNombreCliente.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowTelefonoCliente = require("./flowTelefonoCliente");
const flowPrincipal = require("./flowPrincipal");

const flowNombreCliente = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "👤 *Por favor, ingresa tu nombre completo:*",
    "Ejemplo: María González",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const nombre = ctx.body.trim();

    if (nombre === "0") {
      resetPedido(state);
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(flowPrincipal);
    }

    if (nombre.length < 3 || /\d/.test(nombre)) {
      await flowDynamic(
        [
          "❌ Nombre inválido!",
          "Requerimientos:",
          "→ Mínimo 3 caracteres",
          "→ Solo letras y espacios",
          "Ejemplo válido: Carlos Pérez",
        ].join("\n")
      );
      return fallBack();
    }

    const pedidoActual = getPedidoActual(state);
    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: {
          ...pedidoActual.customerData,
          name: nombre,
        },
      },
    });

    await flowDynamic(`✅ Nombre registrado: *${nombre}*`);
    return gotoFlow(require("./flowTelefonoCliente"));
  }
);

module.exports = flowNombreCliente;
