// flows/flowBondiola.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowBondiola = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🍖 *Bondiola*",
    "",
    "1️⃣ Bondiola fileteada (10 pers) - Incluye: 60 panes + 3 salsas (~$85.000)",
    "2️⃣ Bondiola fileteada (5 pers) - Incluye: 30 panes + 1 salsa (~$45.000)",
    "3️⃣ Bondiola braseada (10 pers) - Incluye: 2 salsas + pancitos (~$95.000)",
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
          category: "Bondiola",
          item: "Bondiola fileteada (10 pers)",
          price: 85000,
          incluye: "60 panes + 3 salsas",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Bondiola",
          item: "Bondiola fileteada (5 pers)",
          price: 45000,
          incluye: "30 panes + 1 salsa",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Bondiola",
          item: "Bondiola braseada (10 pers)",
          price: 95000,
          incluye: "2 salsas + pancitos",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado en el estado para usarlo en flowCantidad
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowBondiola;
