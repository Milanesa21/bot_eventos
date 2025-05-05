// flows/flowTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowCantidad = require("./flowCantidad");

const flowTernera = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥩 *Pata de ternera y Peceto/Vitel Toné*",
    "",
    "1️⃣ Pata de ternera (40 pers) - Incluye: 200 panes + 6 salsas (~$280.000)",
    "2️⃣ Peceto/Vitel Toné fileteado (5 pers) - Incluye: 30 panes + 1 salsa (~$57.000)",
    "3️⃣ Peceto/Vitel Toné fileteado (10 pers) - Incluye: 60 panes + 3 salsas (~$105.000)",
    "4️⃣ Bondiola Filetada (5 pers) - Incluye: 30 panes + 1 salsa (~$48.000)",
    "5️⃣ Bondiola Filetada (10 pers) - Incluye: 60 panes + 3 salsas (~$95.000)",
    "6️⃣ Bondiola Braseada - Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y pancitos (~$95.000)",
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
          category: "Ternera/Peceto",
          item: "Pata de ternera (40 pers)",
          price: 280000,
          incluye: "200 panes + 6 salsas",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (5 pers)",
          price: 57000,
          incluye: "30 panes + 1 salsa",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (10 pers)",
          price: 105000,
          incluye: "60 panes + 3 salsas",
        };
        break;
      case "4":
        selectedItemData = {
          category: "Ternera/Peceto",
          item: "Bondiola Filetada (5 pers)",
          price: 48000,
          incluye: "30 panes + 1 salsa",
        };
        break;
      case "5":
        selectedItemData = {
          category: "Ternera/Peceto",
          item: "Bondiola Filetada (10 pers)",
          price: 95000,
          incluye: "60 panes + 3 salsas",
        };
        break;
      case "6":
        selectedItemData = {
          category: "Ternera/Peceto",
          item: "Bondiola Braseada",
          price: 95000,
          incluye:
            "Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y pancitos",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-6 o 0.");
        return fallBack();
    }

    await state.update({ itemParaCantidad: selectedItemData });
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowTernera;
