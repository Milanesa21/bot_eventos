// flows/flowCantidad.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual, resetPedido } = require("../utils/resetPedido");

const flowCantidad = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { state, flowDynamic, gotoFlow }) => {
    const currentState = await state.getMyState();
    if (!currentState?.itemParaCantidad) {
      console.error("ERROR: Falta itemParaCantidad en el estado");
      await flowDynamic("⚠️ Error técnico. Volviendo al menú principal...");
      return gotoFlow(require("./flowPrincipal"));
    }
  })
  .addAnswer(
    [
      "🔢 ¿Cuántos combos iguales desea agregar?",
      "→ Ejemplos: 1, 5, 10",
      "",
      "0️⃣ Escribe '0' para cancelar",
    ].join("\n"),
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
      const cantidadStr = ctx.body.trim();
      const MAX_ITEMS = 100;

      // Validación de cancelación
      if (cantidadStr === "0") {
        await state.update({ itemParaCantidad: null });
        await flowDynamic("❌ Operación cancelada");
        return gotoFlow(require("./flowPrincipal"));
      }

      // Validación 1: Debe ser un número válido
      if (!/^\d+$/.test(cantidadStr)) {
        await flowDynamic(
          [
            "❌ Formato incorrecto!",
            "Debe ser un número entero positivo sin decimales",
            "Ejemplos válidos: 1, 5, 10",
            "Ejemplos inválidos: 2.5, cinco, -3",
          ].join("\n")
        );
        return fallBack();
      }

      const cantidad = parseInt(cantidadStr, 10);

      // Validación 2: Rango permitido
      if (cantidad < 1 || cantidad > MAX_ITEMS) {
        await flowDynamic(
          [
            `❌ Cantidad fuera de rango!`,
            `Solo se permiten entre 1 y ${MAX_ITEMS} unidades`,
            `Recibido: ${cantidad}`,
          ].join("\n")
        );
        return fallBack();
      }

      // Obtener datos del estado
      const currentState = await state.getMyState();
      const { itemParaCantidad } = currentState;

      // Validación final de estado
      if (!itemParaCantidad) {
        await flowDynamic("⚠️ Error: Producto no encontrado");
        return gotoFlow(require("./flowPrincipal"));
      }

      // Obtener y actualizar el pedido actual
      const pedidoActual = getPedidoActual(state);
      const { item, price, incluye, category } = itemParaCantidad;

      // Agregar items al carrito
      const newCart = [
        ...pedidoActual.cart,
        ...Array(cantidad).fill({
          category,
          item,
          price,
          ...(incluye && { incluye }),
        }),
      ];

      // Actualizar estado
      await state.update({
        pedidoActual: {
          ...pedidoActual,
          cart: newCart,
        },
        itemParaCantidad: null, // Limpiar item temporal
      });

      // Calcular totales
      const precioTotal = price * cantidad;
      const totalItems = newCart.length;

      await flowDynamic(
        [
          `✅ *${cantidad}x ${item}* agregado!`,
          `📦 Unidades totales en carrito: ${totalItems}`,
          `💵 Subtotal por estos items: $${precioTotal.toLocaleString(
            "es-AR"
          )}`,
          `🛒 Continúa agregando productos o ve a finalizar tu pedido`,
        ].join("\n")
      );

      return gotoFlow(require("./flowAgregarItems"));
    }
  );

module.exports = flowCantidad;
