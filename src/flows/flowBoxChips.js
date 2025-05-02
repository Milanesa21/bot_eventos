// flows/flowBoxChips.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowBoxChips = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "📦 *Box de Chips & Combo EXPRESS*",
    "",
    "1️⃣ Box de Chips (40 u) - Mix a coordinar (Precio a consultar)",
    "2️⃣ Combo EXPRESS - 10 pollo + 10 jamón/queso (~$80.000)",
    "0️⃣ Cancelar",
    "",
    "Responde con el número de tu elección.",
  ].join("\n"),
  { capture: true },
  async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
    const opt = ctx.body.trim();

    // Si elige cancelar, vuelve al menú principal
    if (opt === "0") {
      return gotoFlow(require("./flowPrincipal"));
    }

    let selectedItemData;
    switch (opt) {
      case "1":
        selectedItemData = {
          category: "Box Chips",
          item: "Box de Chips (40 u)",
          price: 0,
          incluye: "Mix a coordinar",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Combo EXPRESS",
          item: "Combo EXPRESS",
          price: 80000,
          incluye: "10 chips de pollo + 10 chips de jamón y queso",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-2 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado para que flowCantidad pregunte la cantidad
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo de cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowBoxChips;
