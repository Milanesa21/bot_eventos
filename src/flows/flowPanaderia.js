// flows/flowPanaderia.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el flujo genérico de cantidad
const flowCantidad = require("./flowCantidad");

const flowPanaderia = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥖 *Panadería*",
    "",
    "1️⃣ Bagels (40 unidades) - ~$15.000",
    "2️⃣ Lactal Integral (36 unidades) - ~$5.000",
    "3️⃣ Pan de Manteca (40 unidades) - ~$15.000",
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
          category: "Panadería",
          item: "Bagels (40 u)",
          price: 15000,
          incluye: "40 unidades de bagels",
        };
        break;
      case "2":
        selectedItemData = {
          category: "Panadería",
          item: "Lactal Integral (36 u)",
          price: 5000,
          incluye: "36 unidades de pan lactal integral",
        };
        break;
      case "3":
        selectedItemData = {
          category: "Panadería",
          item: "Pan de Manteca (40 u)",
          price: 15000,
          incluye: "40 unidades de pan de manteca",
        };
        break;
      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack(); // vuelve a preguntar la opción
    }

    // Guardamos el ítem seleccionado en el estado
    await state.update({ itemParaCantidad: selectedItemData });

    // Redirigimos al flujo que pregunta la cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowPanaderia;
