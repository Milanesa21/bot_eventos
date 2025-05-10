// flows/flowNombreCliente.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
// Asegúrate que el nombre del archivo coincida con tu flujo de teléfono
const flowTelefonoCliente = require("./flowTelefonoCliente"); // O flowDatosCliente si así se llama
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
      await resetPedido(state); // VERIFICADO/CORREGIDO: await presente
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

    const pedidoActual = await getPedidoActual(state);
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
    return gotoFlow(flowTelefonoCliente); // O el nombre de tu flujo de teléfono
  }
);

module.exports = flowNombreCliente;
