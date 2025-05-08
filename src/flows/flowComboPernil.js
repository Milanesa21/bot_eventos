// flows/flowComboPernil.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowFileteado = require("./flowFileteado"); // Cambiamos la importación

const flowComboPernil = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🍖🥐 *Combo Pernil + Minutas*",
    "",
    "1️⃣ Combo Pernil (50 pers) - Incluye: 1 Pernil + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches miga (~$350.000)",
    "2️⃣ Combo Pernil (70 pers) - Incluye: 1 Pernil + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches miga (~$490.000)",
    "3️⃣ Combo Pernil (100 pers) - Incluye: 1 Pernil + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches miga (~$770.000)",
    "0️⃣ Cancelar",
    "",
    "Responde con el número de tu elección.",
  ].join("\n"),
  { capture: true },
  async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
    const opt = ctx.body.trim();

    if (opt === "0") {
      return gotoFlow(require("./flowPrincipal"));
    }

    let selectedComboData;
    switch (opt) {
      case "1":
        selectedComboData = {
          baseItem: "Combo Pernil (50 pers)", // Cambiamos a baseItem
          basePrice: 350000,
          baseIncluye:
            "1 Pernil + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches", // baseIncluye
          category: "Combo Pernil",
        };
        break;
      case "2":
        selectedComboData = {
          baseItem: "Combo Pernil (70 pers)",
          basePrice: 490000,
          baseIncluye:
            "1 Pernil + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
          category: "Combo Pernil",
        };
        break;
      case "3":
        selectedComboData = {
          baseItem: "Combo Pernil (100 pers)",
          basePrice: 770000,
          baseIncluye:
            "1 Pernil + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
          category: "Combo Pernil",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }

    await state.update(selectedComboData); // Actualizamos estado con nueva estructura
    return gotoFlow(flowFileteado); // Redirigimos a flowFileteado
  }
);

module.exports = flowComboPernil;
