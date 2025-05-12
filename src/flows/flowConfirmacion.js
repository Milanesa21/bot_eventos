// flows/flowConfirmacion.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");
const flowPrincipal = require("./flowPrincipal");
const flowPago = require("./flowPago");

const flowConfirmacion = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { flowDynamic, state, gotoFlow }) => {
    const pedidoActual = await getPedidoActual(state);

    if (!pedidoActual.cart || pedidoActual.cart.length === 0) {
      await flowDynamic(
        "🛒 Tu carrito está vacío. Escribe 'menu' para empezar."
      );
      return gotoFlow(require("./flowPrincipal"));
    }

    const lines = ["📝 *Resumen de tu pedido:*", ""];
    let subtotalProductos = 0;

    pedidoActual.cart.forEach((item) => {
      lines.push(
        `${item.cantidad}x ${item.item} (${
          item.category
        }) — $${item.total.toLocaleString("es-AR")}`
      );
      subtotalProductos += item.total;
    });

    // Verificar y calcular seguro de tabla
    const seguroTabla = pedidoActual.seguroTabla;
    let totalFinal = subtotalProductos;

    // Si hay seguro de tabla válido (no null/undefined)
    if (seguroTabla !== null && seguroTabla !== undefined) {
      lines.push(`🔒 Seguro de tabla: $${seguroTabla.toLocaleString("es-AR")}`);
      totalFinal += seguroTabla;
    }

    const adelanto = totalFinal * 0.5;
    const customerData = pedidoActual.customerData || {};

    lines.push(
      "",
      `*Subtotal Productos: $${subtotalProductos.toLocaleString("es-AR")}*`,
      `💰 *Total Final:* $${totalFinal.toLocaleString("es-AR")}`,
      "",
      "---",
      "💳 *Condiciones de Pago:*",
      `Adelanto requerido (50%): *$${adelanto.toLocaleString("es-AR")}*`,
      "Debe ser abonado con al menos 7 días de anticipación",
      "---",
      "",
      "👤 *Tus Datos*",
      `👤 Nombre: ${customerData.name || "No especificado"}`,
      `📞 Tel: ${customerData.phone || "No especificado"}`,
      `📅 Fecha: ${customerData.date || "No especificado"}`,
      `⏰ Horario: ${customerData.time || "No especificado"}`,
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
        await resetPedido(state);
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
        await resetPedido(state);
        return gotoFlow(flowPrincipal);
      }

      await flowDynamic("❌ Respuesta no válida. Por favor elige 1️⃣ o 2️⃣");
      return fallBack();
    }
  );

module.exports = flowConfirmacion;
