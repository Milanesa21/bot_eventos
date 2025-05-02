// flows/flowPernil.js - Versión modificada para usar el nuevo flowFileteado
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

// Importa los flujos necesarios
const flowPrincipal = require("./flowPrincipal");
const flowCantidad = require("./flowCantidad");
const flowFileteado = require("./flowFileteado"); // Nuevo flujo de fileteado

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
  
      return gotoFlow(flowPrincipal);
    }

    let baseItem, basePrice, baseIncluye;

    switch (opt) {
      case "1":
     
        baseItem = "Pernil Chico (20 pers)";
        basePrice = 138000;
        baseIncluye = "120 panes + 4 salsas";
        break;
      case "2":
      
        baseItem = "Pernil Grande (30 pers)";
        basePrice = 158000;
        baseIncluye = "160 panes + 6 salsas";

        // Guarda información en el estado y va al flujo de fileteado
        await state.update({ baseItem, basePrice, baseIncluye });

        await flowDynamic(`Has seleccionado *${baseItem}*.`);
      
        return gotoFlow(flowFileteado);

      case "3":

        baseItem = "Pernil Extra Grande (40 pers)";
        basePrice = 179000;
        baseIncluye = "200 panes + 6 salsas grandes";
        break;
      default:

        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }

    // Para los casos que NO requieren fileteado (opciones 1 y 3)
    // Preparamos el item para el flujo de cantidad
    await state.update({
      itemParaCantidad: {
        category: "Pernil",
        item: baseItem,
        price: basePrice,
        incluye: baseIncluye,
      },
    });

    await flowDynamic(`✅ Perfecto, has seleccionado *${baseItem}*.`);
   
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowPernil;
