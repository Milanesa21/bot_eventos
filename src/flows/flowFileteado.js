const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual } = require("../utils/resetPedido");

// Importante: cambiamos las importaciones para evitar problemas de dependencia circular
// No importamos flowCantidad aquí sino que lo requerimos cuando sea necesario
// No importamos flowPrincipal aquí sino que lo requerimos cuando sea necesario

const flowFileteado = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "¿Deseas agregar servicio de fileteado por +$10.000?",
    "1️⃣ Sí",
    "2️⃣ No",
    "0️⃣ Cancelar pedido",
    "",
    "Responde con el número de tu elección.",
  ].join("\n"),
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
    try {
      const resp = ctx.body.trim();
      const currentState = await state.getMyState();
      const pedidoActual = await getPedidoActual(state);

      if (!currentState?.baseItem || !currentState?.basePrice) {
        await flowDynamic(
          "⚠️ Error en la selección. Volviendo al menú principal..."
        );
        return gotoFlow(require("./flowPrincipal"));
      }

      if (resp === "0") {
        await state.update({
          baseItem: null,
          basePrice: null,
          baseIncluye: null,
        });
        await flowDynamic("❌ Pedido cancelado correctamente");
        return gotoFlow(require("./flowPrincipal"));
      }

      if (!["1", "2"].includes(resp)) {
        await flowDynamic(
          [
            "❌ Respuesta no válida",
            "Por favor selecciona:",
            "1️⃣ Sí - Agregar fileteado (+$10.000)",
            "2️⃣ No - Continuar sin fileteado",
            "0️⃣ Cancelar pedido",
          ].join("\n")
        );
        return fallBack();
      }

      let finalItem = currentState.baseItem;
      let finalPrice = currentState.basePrice;
      let finalIncluye = currentState.baseIncluye || "";

      if (resp === "1") {
        finalItem += " con fileteado";
        finalPrice += 10000;
        finalIncluye += finalIncluye
          ? " + Servicio profesional de fileteado"
          : "Servicio profesional de fileteado";
      }

      // Actualizamos el estado con la información del item seleccionado
      await state.update({
        itemParaCantidad: {
          category: currentState.category || "Ternera/Peceto",
          item: finalItem,
          price: finalPrice,
          incluye: finalIncluye.trim() || null,
        },
        // Limpiamos los datos temporales
        baseItem: null,
        basePrice: null,
        baseIncluye: null,
      });

      await flowDynamic(
        [
          "✅ Configuración final:",
          `🍖 Producto: ${finalItem}`,
          `📦 Incluye: ${finalIncluye || "Producto base"}`,
          `💵 Precio final: $${finalPrice.toLocaleString("es-AR")}`,
          "",
          "Ahora seleccionaremos la cantidad...",
        ].join("\n")
      );

      // Importante: Usamos require() para evitar dependencias circulares
      return gotoFlow(require("./flowCantidad"));
    } catch (error) {
      console.error("[Error flowFileteado]", error);
      await flowDynamic("⚠️ Ocurrió un error. Volviendo al menú principal...");
      return gotoFlow(require("./flowPrincipal"));
    }
  }
);

module.exports = flowFileteado;
