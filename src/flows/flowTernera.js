// flows/flowTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowFileteado = require("./flowFileteado");

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
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(require("./flowPrincipal"));
    }

    let selectedData;
    switch (opt) {
      case "1":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Pata de ternera (40 pers)",
          basePrice: 280000,
          baseIncluye: "200 panes + 6 salsas",
        };
        break;

      case "2":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Peceto/Vitel Toné (5 pers)",
          basePrice: 57000,
          baseIncluye: "30 panes + 1 salsa",
        };
        break;

      case "3":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Peceto/Vitel Toné (10 pers)",
          basePrice: 105000,
          baseIncluye: "60 panes + 3 salsas",
        };
        break;

      case "4":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Bondiola Filetada (5 pers)",
          basePrice: 48000,
          baseIncluye: "30 panes + 1 salsa",
        };
        break;

      case "5":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Bondiola Filetada (10 pers)",
          basePrice: 95000,
          baseIncluye: "60 panes + 3 salsas",
        };
        break;

      case "6":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Bondiola Braseada",
          basePrice: 95000,
          baseIncluye:
            "Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y pancitos",
        };
        break;

      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-6 o 0.");
        return fallBack();
    }

    // Actualizar estado y redirigir a fileteado
    await state.update(selectedData);
    return gotoFlow(flowFileteado);
  }
);

module.exports = flowTernera;
