// flows/flowCantidad.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual } = require("../utils/resetPedido");

const flowCantidad = addKeyword(EVENTS.ACTION)
  .addAction(async (_, { state, flowDynamic, gotoFlow }) => {
    const currentState = await state.getMyState();
    if (
      !currentState?.itemParaCantidad?.item ||
      currentState?.itemParaCantidad?.price === undefined
    ) {
      await flowDynamic(
        "⚠️ Hubo un problema al seleccionar el producto. Volviendo al menú principal..."
      );
      return gotoFlow(require("./flowPrincipal"));
    }
  })
  .addAnswer(
    [
      "🔢 ¿Cuántos Combos desea?",
      "",
      "Ejemplo (ej: 1, 2, 3...)",
      "0️⃣ para Cancelar y volver al menú",
    ].join("\n"),
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
      const cantidadStr = ctx.body.trim();
      const currentState = await state.getMyState();
      const pedidoPrevio = await getPedidoActual(state);


    

      const carritoExistente = Array.isArray(pedidoPrevio.cart)
        ? pedidoPrevio.cart
        : [];

      if (cantidadStr === "0") {
        await state.update({ itemParaCantidad: null });
        await flowDynamic("❌ Operación cancelada.");
        return gotoFlow(require("./flowPrincipal"));
      }

      const cantidad = parseInt(cantidadStr, 10);

      if (isNaN(cantidad) || cantidad <= 0) {
        // Combinada validación
        const mensajeErrorCantidad = isNaN(cantidad)
          ? [
              "❌ *Formato incorrecto*",
              "Debes ingresar un número entero.",
              "Ejemplos: 1, 2, 3...",
            ].join("\n")
          : [
              "❌ *Cantidad inválida*",
              "La cantidad debe ser mayor a 0.",
              "Si deseas cancelar usa el comando 0️⃣",
            ].join("\n");
        await flowDynamic(mensajeErrorCantidad);
        return fallBack();
      }

      const {
        category = "General",
        item = "Producto sin nombre",
        price = 0,
        incluye,
      } = currentState.itemParaCantidad;

      const nuevoItemParaElCarrito = {
        category,
        item,
        price,
        cantidad,
        incluye: incluye || "Sin descripción",
        total: price * cantidad,
      };

      const carritoActualizado = [...carritoExistente, nuevoItemParaElCarrito];

      const proximoPedidoActual = {
        ...pedidoPrevio,
        cart: carritoActualizado,
      };
 
      await state.update({
        pedidoActual: proximoPedidoActual,
        itemParaCantidad: null,
      });

      await flowDynamic(
        [
          `✅ *${cantidad} x ${item}* agregado(s) al pedido.`,
          `💵 Subtotal por este/os item(s): $${(
            price * cantidad
          ).toLocaleString("es-AR")}`,
        ].join("\n")
      );
      return gotoFlow(require("./flowAgregarItems"));
    }
  );

module.exports = flowCantidad;
