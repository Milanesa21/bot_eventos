// flows/flowPernil.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowPrincipal = require("./flowPrincipal");
const flowFileteado = require("./flowFileteado");

const flowPernil = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🍖 *Pernil*",
    "",
    "1️⃣ Pernil Chico (20 pers) - Incluye: 120 panes + 4 salsas (~$138.000)",
    "2️⃣ Pernil Grande (30 pers) - Incluye: 160 panes + 6 salsas (~$158.000) — Fileteado +$10.000",
    "3️⃣ Pernil Extra Grande (40 pers) - Incluye: 200 panes + 6 salsas grandes (~$179.000)",
    "0️⃣ Cancelar",
    "",
    "Responde con el número de tu elección.",
  ].join("\n"),
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
    const opt = ctx.body.trim();

    if (opt === "0") {
      await flowDynamic("❌ Pedido cancelado");
      return gotoFlow(flowPrincipal);
    }

    let selectedData;
    switch (opt) {
      case "1":
        selectedData = {
          category: "Pernil",
          baseItem: "Pernil Chico (20 pers)",
          basePrice: 138000,
          baseIncluye: "120 panes + 4 salsas",
        };
        break;

      case "2":
        selectedData = {
          category: "Pernil",
          baseItem: "Pernil Grande (30 pers)",
          basePrice: 158000,
          baseIncluye: "160 panes + 6 salsas",
        };
        break;

      case "3":
        selectedData = {
          category: "Pernil",
          baseItem: "Pernil Extra Grande (40 pers)",
          basePrice: 179000,
          baseIncluye: "200 panes + 6 salsas grandes",
        };
        break;

      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }

    // Actualizar estado y confirmación común para todas las opciones
    await state.update(selectedData);

    await flowDynamic(
      [
        `✅ Selección base: *${selectedData.baseItem}*`,
        `📦 Incluye: ${selectedData.baseIncluye}`,
        `💵 Precio base: $${selectedData.basePrice.toLocaleString("es-AR")}`,
      ].join("\n")
    );

    return gotoFlow(flowFileteado);
  }
);

module.exports = flowPernil;
