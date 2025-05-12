// flows/flowTernera.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowFileteado = require("./flowFileteado");
const flowCantidad = require("./flowCantidad"); 
const flowPrincipal = require("./flowPrincipal"); 
const { getPedidoActual } = require("../utils/resetPedido"); 

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

    let selectedData; 

    switch (opt) {
      case "1":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Pata de ternera (40 pers)",
          basePrice: 280000,
          baseIncluye: "200 panes + 6 salsas",
        };
        // No retornamos aquí todavía, la lógica común va después del switch
        break;

      case "2":
        selectedData = {
          category: "Ternera/Peceto",
          baseItem: "Pata de ternera Grande (60 pers)",
          basePrice: 350000,
          baseIncluye: "300 panes + 8 salsas",
        };
        // No retornamos aquí todavía
        break;

      case "3": {
        // Lógica específica para Peceto/Vitel Toné 5 pers
        const itemSeleccionado = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (5 pers)",
          price: 57000,
          incluye: "30 panes + 1 salsa",
        };
        await state.update({
          itemParaCantidad: itemSeleccionado,
          // Limpiamos datos base por si acaso
          baseItem: null,
          basePrice: null,
          baseIncluye: null,
          // No modificamos seguroTabla aquí
        });
        return gotoFlow(flowCantidad); // Usar la variable importada
      }

      case "4": {
        // Lógica específica para Peceto/Vitel Toné 10 pers
        const itemSeleccionado = {
          category: "Ternera/Peceto",
          item: "Peceto/Vitel Toné (10 pers)",
          price: 105000,
          incluye: "60 panes + 3 salsas",
        };
        await state.update({
          itemParaCantidad: itemSeleccionado,
          // Limpiamos datos base por si acaso
          baseItem: null,
          basePrice: null,
          baseIncluye: null,
          // No modificamos seguroTabla aquí
        });
        return gotoFlow(flowCantidad); // Usar la variable importada
      }

      default:
        // Opción no válida
        await flowDynamic("❌ Opción no válida. Por favor responde 1-4 o 0.");
        return fallBack();
    }

    // --- Inicio: Lógica común para opciones 1 y 2 (Pata de ternera) ---
    if (selectedData) {
      // Obtener el estado actual del pedido
      const pedidoActual = await getPedidoActual(state);

      // Verificar y actualizar seguroTabla si es null
      if (pedidoActual.seguroTabla === null) {
        pedidoActual.seguroTabla = 7000;
        console.log(
          `Seguro de tabla añadido (Ternera ${opt}):`,
          pedidoActual.seguroTabla
        );
      } else {
        console.log(
          `Seguro de tabla ya existe (Ternera ${opt}), no se modifica:`,
          pedidoActual.seguroTabla
        );
      }

      
      await state.update({
        ...selectedData,
        pedidoActual: pedidoActual,
      });

      
      await flowDynamic(
        [
          `✅ Selección base: *${selectedData.baseItem}*`,
          `📦 Incluye: ${selectedData.baseIncluye}`,
          `💵 Precio base: $${selectedData.basePrice.toLocaleString("es-AR")}`,
          // Mostrar si se añadió el seguro
          pedidoActual.seguroTabla === 7000
            ? `🔒 Se añadió seguro de tabla: $${pedidoActual.seguroTabla.toLocaleString(
                "es-AR"
              )}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      );

      
      return gotoFlow(flowFileteado);
    }
   
  }
);

module.exports = flowTernera;
