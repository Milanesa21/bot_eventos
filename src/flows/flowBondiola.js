// flows/flowBondiola.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowFileteado = require("./flowFileteado");

const flowBondiola = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🍖 *Bondiola*",
    "",
    "1️⃣ Bondiola Filetada (5 pers) - Incluye: 30 panes + 1 salsa (~$48.000)",
    "2️⃣ Bondiola Filetada (10 pers) - Incluye: 60 panes + 3 salsas (~$95.000)",
    "3️⃣ Bondiola Braseada - Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y pancitos (~$95.000)",
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

    switch (opt) {
      case "1":
        await state.update({
          baseItem: "Bondiola Filetada (5 pers)",
          basePrice: 48000,
          baseIncluye: "30 panes + 1 salsa",
          category: "Bondiola",
        });
        return gotoFlow(flowFileteado);

      case "2":
        await state.update({
          baseItem: "Bondiola fileteada (10 pers)",
          basePrice: 95000,
          baseIncluye: "60 panes + 3 salsas",
          category: "Bondiola",
        });
        return gotoFlow(flowFileteado);

      case "3":
        await state.update({
          baseItem: "Bondiola braseada",
          basePrice: 95000,
          baseIncluye: "2 salsas + pancitos",
          category: "Bondiola",
        });
        return gotoFlow(flowFileteado);

      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }
  }
);

module.exports = flowBondiola;
