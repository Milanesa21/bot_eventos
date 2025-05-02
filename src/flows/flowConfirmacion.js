// flows/flowConfirmacion.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual, resetPedido } = require("../utils/resetPedido");
const flowPrincipal = require("./flowPrincipal");
const flowPago = require("./flowPago")

const flowConfirmacion = addKeyword(EVENTS.ACTION)
  // 1) Acción para CONSTRUIR y ENVIAR el resumen del pedido
  .addAction(async (_, { flowDynamic, state }) => {
    const resumenAgrupado = {};

    if (!pedidoActual.cart || pedidoActual.cart.length === 0) {
      await flowDynamic(
        "🛒 Tu carrito está vacío. Escribe 'menu' para empezar a ordenar."
      );
      return; // Detiene esta acción si el carrito está vacío
    }

    pedidoActual.cart.forEach((item) => {
      const itemKey = item.item;
      if (resumenAgrupado[itemKey]) {
        resumenAgrupado[itemKey].quantity++;
      } else {
        resumenAgrupado[itemKey] = { ...item, quantity: 1 };
      }
    });

    const lines = ["📝 *Resumen de tu pedido:*", ""];

    Object.values(resumenAgrupado).forEach((groupedItem) => {
      lines.push(
        `${groupedItem.quantity}x ${groupedItem.item} (${
          groupedItem.category
        }) — $${(groupedItem.price * groupedItem.quantity).toLocaleString(
          "es-AR"
        )}`
      );
    });

    const subtotal = pedidoActual.cart.reduce((s, i) => s + i.price, 0);
    const seguro = 7000; // Revisa este valor
    const total = subtotal + seguro;

    // --- NUEVO: Cálculo del adelanto ---
    const adelanto = total * 0.5;
    // --- FIN NUEVO ---

    lines.push(
      "",
      `*Subtotal Productos: $${subtotal.toLocaleString("es-AR")}*`,
      `🔒 Seguro de tabla: $${seguro.toLocaleString("es-AR")}`,
      `💰 *Total Final:* $${total.toLocaleString("es-AR")}`,
      "",
      // --- NUEVO: Sección Condiciones de Pago ---
      "---", // Separador
      "💳 *Condiciones de Pago:*",
      `Se requiere abonar el 50% del total como adelanto para confirmar la reserva.`,
      `Monto del adelanto (50%): *$${adelanto.toLocaleString("es-AR")}*`,
      `Este monto debe ser abonado con *al menos una semana de anticipación* a la fecha del evento.`,
      "---", // Separador
      // --- FIN NUEVO ---
      "",
      "👤 *Tus Datos*",
      `👤 Nombre: ${pedidoActual.customerData?.name || "No especificado"}`,
      `📞 Tel: ${pedidoActual.customerData?.phone || "No especificado"}`,
      `📅 Fecha Evento: ${
        pedidoActual.customerData?.date || "No especificado"
      }`,
      `🏠 Dirección Entrega: ${
        pedidoActual.customerData?.address || "No especificado"
      }`,
      pedidoActual.customerData?.comments
        ? `🗒️ Comentarios: ${pedidoActual.customerData.comments}`
        : "",
      "---",
      "",
      "¿Confirmas este pedido y las condiciones?", // Ajustamos la pregunta
      "1️⃣ Sí, confirmar pedido",
      "2️⃣ No, cancelar pedido"
    );

    await flowDynamic(lines.filter(Boolean).join("\n"));
  }) // Fin de addAction

  // 2) addAnswer para capturar la confirmación (Sí/No) - Sin cambios aquí
  .addAnswer(
    "Responde 1️⃣ para confirmar o 2️⃣ para cancelar",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, endFlow, fallBack }) => {
      const resp = ctx.body.trim().toLowerCase();

      if (resp === "1" || resp.includes("sí") || resp.includes("si")) {
        await flowDynamic(
          "✅ *¡Pedido confirmado!* ✅\n\n" +
            "Gracias por confiar en *Angélica Perniles*.\n" +
            "A continuación, elige tu método de pago."
        );
        // Redirigimos al flujo de pago
        resetPedido();
        return gotoFlow(flowPago);
      }

      if (resp === "2" || resp.includes("no")) {
        await flowDynamic(
          "❌ *Pedido cancelado* ❌\n\n" +
            'Tu pedido ha sido cancelado.'
        );
        resetPedido();
        return gotoFlow(flowPrincipal)
      }

      await flowDynamic("❌ No entendí. Por favor responde 1️⃣ (Sí) o 2️⃣ (No).");
      return fallBack();
    }
  ); // Fin de addAnswer

module.exports = flowConfirmacion;
