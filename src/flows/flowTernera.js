// flows/flowTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowFileteado = require("./flowFileteado");


const flowTernera = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🥩 *Pata de ternera y Peceto/Vitel Toné*",
    "",
    "1️⃣ Pata de ternera (40 pers) - Incluye: 200 panes + 6 salsas (~$280.000)",
    "2️⃣ Pata de ternera Grande (60 pers) - Incluye: 300 panes + 8 salsas (~$350.000)", 
    "3️⃣ Peceto/Vitel Toné fileteado (5 pers) - Incluye: 30 panes + 1 salsa (~$57.000)", 
    "4️⃣ Peceto/Vitel Toné fileteado (10 pers) - Incluye: 60 panes + 3 salsas (~$105.000)", 
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
      case "1": {
        // Opciones que SÍ van a flowFileteado
        const selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Pata de ternera (40 pers)",
          basePrice: 280000,
          baseIncluye: "200 panes + 6 salsas",
        };

        await state.update(selectedData);
  
        return gotoFlow(flowFileteado);
       
      } 

      case "2": {
        // Opciones que SÍ van a flowFileteado
        const selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Pata de ternera Grande (60 pers)",
          basePrice: 350000,
          baseIncluye: "300 panes + 8 salsas",
        };

        await state.update(selectedData);

        return gotoFlow(flowFileteado);
      }

      case "3": {
  
        const itemSeleccionado = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (5 pers)", 
          price: 57000,
          incluye: "30 panes + 1 salsa", 
        };

        await state.update({
          itemParaCantidad: itemSeleccionado,
 
          baseItem: null,
          basePrice: null,
          baseIncluye: null,
        });

        return gotoFlow(require("./flowCantidad"));
      }

      case "4": {

        const itemSeleccionado = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (10 pers)",
          price: 105000,
          incluye: "60 panes + 3 salsas",
        };

        await state.update({
          itemParaCantidad: itemSeleccionado,

          baseItem: null,
          basePrice: null,
          baseIncluye: null,
        });

        return gotoFlow(require("./flowCantidad"));
      }

      default:

        await flowDynamic("❌ Opción no válida. Por favor responde 1-4 o 0.");
        return fallBack();
    }
  }
);

module.exports = flowTernera;
