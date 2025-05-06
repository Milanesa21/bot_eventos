// flows/flowDireccionEntrega.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowDireccionEntrega = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🏠 *Ingresa la dirección completa de entrega:*",
    "Debe incluir:",
    "→ Barrio",
    "→ Calle/Avenida",
    "→ Número de casa/edificio",
    "→ *Cada parte de la direccion escrita debe estar separada por comas*",
    "",
    "Ejemplo válido:",
    "`Caballito, Av. Rivadavia 4567, Departamento 3`",
    "",
    "0️⃣ Escribe '0' para cancelar el pedido",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
    const input = ctx.body.trim();

    // Manejar cancelación
    if (input === "0") {
      resetPedido(state);
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    // Validar dirección
    const partes = input.split(",").map((p) => p.trim());
    const tieneNumero = /\d/.test(input);

    if (partes.length < 3 || !tieneNumero) {
      await flowDynamic(
        [
          "❌ Dirección incompleta!",
          "Debe contener:",
          "1. Barrio/Localidad",
          "2. Calle/Avenida",
          "3. Número y detalles",
          "4. La direccion escrita debe estar separada por comas",
          "",
          "Ejemplo válido:",
          "`Caballito, Av. Rivadavia 4567, Departamento 3`",
        ].join("\n")
      );
      return fallBack();
    }

    // Actualizar estado
    const pedidoActual = getPedidoActual(state);
    const newCustomerData = {
      ...pedidoActual.customerData,
      address: input,
    };

    await state.update({
      pedidoActual: {
        ...pedidoActual,
        customerData: newCustomerData,
      },
    });

    // Mostrar confirmación
    await flowDynamic(
      [
        "✅ Dirección guardada:",
        `📍 *Barrio:* ${partes[0]}`,
        `🛣️ *Calle:* ${partes[1]}`,
        `🏡 *Número/Detalles:* ${partes.slice(2).join(", ")}`,
      ].join("\n")
    );

    return gotoFlow(require("./flowComentarios"));
  }
);

module.exports = flowDireccionEntrega;
