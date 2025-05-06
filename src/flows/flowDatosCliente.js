// flows/flowDatosCliente.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowDatosCliente = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📱 *Ingresa tu número de teléfono:*",
    "→ Formato requerido: Código de área + Número",
    "• 370 4123456 (móvil)",
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

    // Validar formato del teléfono (adaptado para Formosa)
    const phoneRegex = /^(370|3717)[\s-]?(\d{7,8})$/;
    if (!phoneRegex.test(input)) {
      await flowDynamic(
        [
          "❌ Formato incorrecto para Formosa!",
          "Debe ser:",
          "• Móvil: 370 + 8 números (ej: 370 41234567)",
          "",
          "Otros ejemplos válidos:",
          "• 3704123456",

        ].join("\n")
      );
      return fallBack();
    }

    // Normalizar número
    const normalizedPhone = input.replace(/[\s-]/g, "");

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

    // Formatear para mostrar
    await flowDynamic(
      [
        "✅ Número guardado correctamente:",
        `📞 ${formatearTelefono(normalizedPhone)}`,
        "Ahora necesitamos la fecha del evento...",
      ].join("\n")
    );

    return gotoFlow(require("./flowFechaEvento"));
  }
);

// Función de formateo adaptada
const formatearTelefono = (num) => {
  const esMovil = num.startsWith("370");
  if (esMovil) {
    return `${num.slice(0, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
  }
  return `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
};

module.exports = flowDatosCliente;
