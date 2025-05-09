// flows/flowMenuKids.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowMenuKids = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "👶 *Menú Kids*",
    "",
    "1️⃣ Promo CUMPLE (30 niños) - Incluye: 48 pizzetas, 24 sándwiches de miga, 24 empanadas copetín, 24 salchichas envueltas, 24 patitas de pollo (~$270.000)",
    "2️⃣ Promo ESTÁNDAR (10 niños) - Incluye: 10 chips de pollo, 10 chips de jamón y queso, 15 patitas de pollo, 10 salchichas encamisadas, 15 pizzetas (~$100.000)",
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
          category: "Menú Kids",
          item: "Promo CUMPLE (30 niños)",
          price: 270000,
          incluye:
            "48 pizzetas, 24 sándwiches de miga, 24 empanadas copetín, 24 salchichas envueltas, 24 patitas de pollo",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Menú Kids",
          item: "Promo ESTÁNDAR (10 pers)",
          price: 100000,
          incluye:
            "10 chips de pollo, 10 chips de jamón y queso, 15 patitas de pollo, 10 salchichas encamisadas, 15 pizzetas",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1, 2 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado en el estado
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowMenuKids;
