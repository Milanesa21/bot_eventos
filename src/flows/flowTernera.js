// flows/flowTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowTernera = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥩 *Pata de ternera, Paleta y Peceto/Vitel Toné*",
    "",
    "1️⃣ Pata de ternera (40 pers) - Incluye: 200 panes + 6 salsas (~$220.000)",
    "2️⃣ Paleta (15 pers) - Incluye: 40 panes + 2 salsas (~$80.000)",
    "3️⃣ Peceto fileteado (5 pers) - Incluye: 30 panes + 1 salsa (~$45.000)",
    "4️⃣ Peceto fileteado (10 pers) - Incluye: 60 panes + 3 salsas (~$85.000)",
    "5️⃣ Vitel Toné (5 pers) - Incluye: 30 panes + 1 salsa (~$48.000)",
    "6️⃣ Vitel Toné (10 pers) - Incluye: 60 panes + 3 salsas (~$90.000)",
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
          category: "Ternera/Paleta/Peceto",
          item: "Pata de ternera (40 pers)",
          price: 220000,
          incluye: "200 panes + 6 salsas",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Ternera/Paleta/Peceto",
          item: "Paleta (15 pers)",
          price: 80000,
          incluye: "40 panes + 2 salsas",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Ternera/Paleta/Peceto",
          item: "Peceto fileteado (5 pers)",
          price: 45000,
          incluye: "30 panes + 1 salsa",
        };
        break;
      case "4":
        selectedItemData = {
          category: "Ternera/Paleta/Peceto",
          item: "Peceto fileteado (10 pers)",
          price: 85000,
          incluye: "60 panes + 3 salsas",
        };
        break;
      case "5":
        selectedItemData = {
          category: "Ternera/Paleta/Peceto",
          item: "Vitel Toné (5 pers)",
          price: 48000,
          incluye: "30 panes + 1 salsa",
        };
        break;
      case "6":
        selectedItemData = {
          category: "Ternera/Paleta/Peceto",
          item: "Vitel Toné (10 pers)",
          price: 90000,
          incluye: "60 panes + 3 salsas",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-6 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado en el estado
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowTernera;
