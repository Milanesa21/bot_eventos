// flows/flowConfirmacion.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowPrincipal = require("./flowPrincipal");
const flowPago = require("./flowPago");

const flowConfirmacion = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { flowDynamic, state }) => {
    const pedidoActual = getPedidoActual(state);
    const resumenAgrupado = {};

    if (!pedidoActual.cart || pedidoActual.cart.length === 0) {
      await flowDynamic(
        "🛒 Tu carrito está vacío. Escribe 'menu' para empezar."
      );
      return;
    }

    // Agrupar items
    pedidoActual.cart.forEach((item) => {
      const itemKey = item.item;
      resumenAgrupado[itemKey] = resumenAgrupado[itemKey] || {
        ...item,
        quantity: 0,
      };
      resumenAgrupado[itemKey].quantity++;
    });

    const lines = ["📝 *Resumen de tu pedido:*", ""];

    // Construir líneas del resumen
    Object.values(resumenAgrupado).forEach((item) => {
      lines.push(
        `${item.quantity}x ${item.item} (${item.category}) — $${(
          item.price * item.quantity
        ).toLocaleString("es-AR")}`
      );
    });

    // Cálculos financieros
    const subtotal = pedidoActual.cart.reduce(
      (acc, item) => acc + item.price,
      0
    );
    const seguro = 7000;
    const total = subtotal + seguro;
    const adelanto = total * 0.5;

    // Sección de datos del cliente
    const customerData = pedidoActual.customerData || {};
    lines.push(
      "",
      `*Subtotal Productos: $${subtotal.toLocaleString("es-AR")}*`,
      `🔒 Seguro de tabla: $${seguro.toLocaleString("es-AR")}`,
      `💰 *Total Final:* $${total.toLocaleString("es-AR")}`,
      "",
      "---",
      "💳 *Condiciones de Pago:*",
      `Adelanto requerido (50%): *$${adelanto.toLocaleString("es-AR")}*`,
      "Debe ser abonado con al menos 7 días de anticipación",
      "---",
      "",
      "👤 *Tus Datos*",
      `📞 Tel: ${customerData.phone || "No especificado"}`,
      `📅 Fecha: ${customerData.date || "No especificado"}`,
      `🏠 Dirección: ${customerData.address || "No especificado"}`,
      customerData.comments ? `🗒️ Comentarios: ${customerData.comments}` : "",
      "---",
      "",
      "¿Confirmas este pedido y las condiciones?",
      "1️⃣ Sí, confirmar pedido",
      "2️⃣ No, cancelar pedido"
    );

    await flowDynamic(lines.filter(Boolean).join("\n"));
  })
  .addAnswer(
    "Responde 1️⃣ para confirmar o 2️⃣ para cancelar",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
      const resp = ctx.body.trim().toLowerCase();

      if (resp === "1" || resp.includes("sí") || resp.includes("si")) {
        await flowDynamic(
          [
            "✅ *¡Pedido confirmado!*",
            "Gracias por confiar en *Angélica Perniles*",
            "Elige tu método de pago:",
          ].join("\n")
        );

        resetPedido(state); // Limpiamos solo ESTE pedido
        return gotoFlow(flowPago);
      }

      if (resp === "2" || resp.includes("no")) {
        await flowDynamic(
          [
            "❌ *Pedido cancelado*",
            "Todos los datos han sido eliminados",
            "Puedes comenzar de nuevo cuando quieras",
          ].join("\n")
        );

        resetPedido(state);
        return gotoFlow(flowPrincipal);
      }

      await flowDynamic("❌ Respuesta no válida. Por favor elige 1️⃣ o 2️⃣");
      return fallBack();
    }
  );

module.exports = flowConfirmacion;
