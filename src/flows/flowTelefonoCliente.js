// flows/flowDatosCliente.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowDatosCliente = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📱 *Ingresa tu número de teléfono:*",
    "Puedes usar cualquier formato:",
    "Ejemplos:",
    "→ 3704123456",
    "→ 123-456-7890",
    "→ 555 1234 5678",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const input = ctx.body.trim();

    // Manejar cancelación
    if (input === "0") {
      resetPedido(state);
      await flowDynamic(
        [
          "❌ Pedido cancelado",
          "Todos los datos han sido eliminados",
          'Escribe "menu" para comenzar de nuevo',
        ].join("\n")
      );
      return gotoFlow(require("./flowPrincipal"));
    }

    // Normalizar número (quitar espacios y caracteres especiales)
    const normalizedPhone = input.replace(/[^\d]/g, "");

    // Validación básica de longitud
    if (normalizedPhone.length < 8) {
      await flowDynamic(
        [
          "❌ Número muy corto!",
          "Por favor ingresa un número válido",
          "Mínimo 8 dígitos",
        ].join("\n")
      );
      return fallBack();
    }

    // Actualizar estado
    const pedidoActual = getPedidoActual(state);
    const newCustomerData = {
      ...pedidoActual.customerData,
      phone: normalizedPhone,
    };

    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: newCustomerData,
      },
    });

    await flowDynamic(
      [
        "✅ Número guardado correctamente:",
        `📞 ${normalizedPhone}`,
        "Ahora necesitamos la fecha del evento...",
      ].join("\n")
    );

    return gotoFlow(require("./flowFechaEvento"));
  }
);

module.exports = flowDatosCliente;
