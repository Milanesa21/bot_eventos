// flows/flowComboTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowComboTernera = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥩🥐 *Combo Ternera + Minutas*",
    "",
    "1️⃣ Combo Ternera (50 pers) - Incluye: 1 Pata de ternera + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches (~$454.000)",
    "2️⃣ Combo Ternera (70 pers) - Incluye: 1 Pata de ternera + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches (~$600.000)",
    "3️⃣ Combo Ternera (100 pers) - Incluye: 1 Pata de ternera + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches (~$880.000)",
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
          category: "Combo Ternera",
          item: "Combo Ternera (50 pers)",
          price: 454000,
          incluye:
            "1 Pata de ternera + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Combo Ternera",
          item: "Combo Ternera (70 pers)",
          price: 600000,
          incluye:
            "1 Pata de ternera + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Combo Ternera",
          item: "Combo Ternera (100 pers)",
          price: 880000,
          incluye:
            "1 Pata de ternera + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack(); // Repite la pregunta
    }

    // Guardamos el ítem seleccionado en el estado
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowComboTernera;
