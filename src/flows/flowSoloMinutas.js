// flows/flowSoloMinutas.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowCantidad = require("./flowCantidad");

const flowSoloMinutas = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥟 *Solo Minutas*",
    "",
    "1️⃣ Solo Minutas (15 pers) - Incluye: 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches de miga (~$174.000)",
    "2️⃣ Solo Minutas (30 pers) - Incluye: 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches de miga (~$320.000)",
    "3️⃣ Solo Minutas (60 pers) - Incluye: 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches de miga (~$600.000)",
    "4️⃣ Solo Minutas (15 pers) - Incluye: 48 empanadas y 48 pizzetas (~$150.000)",
    "5️⃣ Solo Minutas (30 pers) - Incluye: 96 empanadas y 96 pizzetas (~$290.000)",
    "6️⃣ Solo Minutas (60 pers) - Incluye: 192 empanadas y 192 pizzetas (~$560.000)",
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
          category: "Solo Minutas",
          item: "Solo Minutas (15 pers)",
          price: 174000,
          incluye: "24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (30 pers)",
          price: 320000,
          incluye: "48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (60 pers)",
          price: 600000,
          incluye: "96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
        };
        break;
      case "4":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (15 pers)",
          price: 150000,
          incluye: "48 empanadas y 48 pizzetas",
        };
        break;
      case "5":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (30 pers)",
          price: 290000,
          incluye: "96 empanadas y 96 pizzetas",
        };
        break;
      case "6":
        selectedItemData = {
          category: "Solo Minutas",
          item: "Solo Minutas (60 pers)",
          price: 560000,
          incluye: "192 empanadas y 192 pizzetas",
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

module.exports = flowSoloMinutas;
