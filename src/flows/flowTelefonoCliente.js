// flows/flowDatosCliente.js (o flowTelefonoCliente.js)
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowFechaEvento = require("./flowFechaEvento");
const flowPrincipal = require("./flowPrincipal");

const flowDatosCliente = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📱 *Ingresa tu número de teléfono:*",
    "Puedes usar cualquier formato:",
    "Ejemplos:",
    "→ 3704123456",
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

    const normalizedPhone = input.replace(/[^\d]/g, "");

    if (normalizedPhone.length < 8) {
      // Ajusta la longitud mínima si es necesario
      await flowDynamic(
        [
          "❌ Número muy corto!",
          "Por favor ingresa un número válido",
          "Mínimo 8 dígitos",
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
          phone: normalizedPhone,
        },
      },
    });

    await flowDynamic(
      [
        "✅ Número guardado correctamente:",
        `📞 ${normalizedPhone}`,
        "Ahora necesitamos la fecha del evento...",
      ].join("\n")
    );

    return gotoFlow(flowFechaEvento);
  }
);

module.exports = flowDatosCliente;
