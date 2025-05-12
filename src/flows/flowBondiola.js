// flows/flowBondiola.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");


const flowBondiola = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🍖 *Bondiola*",
    "",
    "1️⃣ Bondiola Braseada Fileteada(5 pers) - Incluye: 30 panes + 1 salsa (~$48.000)",
    "2️⃣ Bondiola Braseada Fileteada (10 pers) - Incluye: 60 panes + 3 salsas (~$95.000)",
    "3️⃣ Bondiola Braseada (10 pers) - Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y 60 panes (~$95.000)",
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


    let itemSeleccionado = null;

    switch (opt) {
      case "1":
        itemSeleccionado = {
          category: "Bondiola", 
          item: "Bondiola Braseada Fileteada (5 pers)", 
          price: 48000, 
          incluye: "30 panes + 1 salsa", 
        };
        break;

      case "2":
        itemSeleccionado = {
          category: "Bondiola",
          item: "Bondiola Braseada Fileteada (10 pers)",
          price: 95000,
          incluye: "60 panes + 3 salsas",
        };
        break; 
      case "3":
        itemSeleccionado = {
          category: "Bondiola",
          item: "Bondiola braseada (10 pers)",
          price: 95000,
          incluye:
            "Desmechada a la cerveza, con cebolla caramelizada, 2 salsas y 60 panes",
        };
        break; 

      default:
        await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
        return fallBack();
    }

    if (itemSeleccionado) {
      await state.update({
        itemParaCantidad: itemSeleccionado,
      
        baseItem: null,
        basePrice: null,
        baseIncluye: null,
      });
   
      return gotoFlow(require("./flowCantidad"));
    }
  
  }
);

module.exports = flowBondiola;
