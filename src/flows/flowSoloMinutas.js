// flows/flowSoloMinutas.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowSoloMinutas = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥟 *Solo Minutas*",
    "",
    "1️⃣ Solo Minutas (15 pers) - Incluye: 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches (~$174.000)",
    "2️⃣ Solo Minutas (30 pers) - Incluye: 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches (~$320.000)",
    "3️⃣ Solo Minutas (60 pers) - Incluye: 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches (~$600.000)",
    "0️⃣ Cancelar",
    "",
    "Responde con el número de tu elección.",
  ].join("\n"),
  { capture: true },
  async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
    const opt = ctx.body.trim();

    // Cancelar y volver al menú principal
    if (opt === "0") {
      return gotoFlow(require("./flowPrincipal"));
    }

    let selectedItemData;
    switch (opt) {
      case "1":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (15 pers)",
          price: 174000,
          incluye: "24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (30 pers)",
          price: 320000,
          incluye: "48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (60 pers)",
          price: 600000,
          incluye: "96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado en el estado
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowSoloMinutas;
