// flows/flowComboTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowFileteado = require("./flowFileteado"); // Cambiamos la importación

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

    if (opt === "0") {
      return gotoFlow(require("./flowPrincipal"));
    }

    let selectedItemData;
    switch (opt) {
      case "1":
        selectedItemData = {
          category: "Combo Ternera",
          baseItem: "Combo Ternera (50 pers)", // Cambiamos a baseItem
          basePrice: 454000,
          baseIncluye:
            "1 Pata de ternera + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches", // baseIncluye
        };
        break;
      case "2":
        selectedItemData = {
          category: "Combo Ternera",
          baseItem: "Combo Ternera (70 pers)",
          basePrice: 600000,
          baseIncluye:
            "1 Pata de ternera + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Combo Ternera",
          baseItem: "Combo Ternera (100 pers)",
          basePrice: 880000,
          baseIncluye:
            "1 Pata de ternera + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }

    // Actualizamos el estado con la nueva estructura
    await state.update(selectedItemData);

    // Redirigimos al flujo fileteado
    return gotoFlow(flowFileteado);
  }
);

module.exports = flowComboTernera;
