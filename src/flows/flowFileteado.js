// flows/flowFileteado.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowCantidad = require("./flowCantidad");
const flowPrincipal = require("./flowPrincipal");

/**
 * Este flujo maneja exclusivamente la lógica para preguntar al usuario
 * si desea agregar fileteado a su pernil grande y procesar su respuesta.
 */
const flowFileteado = addKeyword(EVENTS.ACTION).addAnswer(
  ["¿Deseas fileteado por +$10.000?", "1️⃣ Sí", "2️⃣ No", "0️⃣ Cancelar"].join(
    "\n"
  ),
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
    const resp = ctx.body.trim();
    
    // Opción para cancelar y volver al menú principal
    if (resp === "0") {
      return gotoFlow(flowPrincipal);
    }

    // Validar que la respuesta sea 1 o 2
    if (resp !== "1" && resp !== "2") {
      await flowDynamic("❌ Opción no válida. Por favor responde 1, 2 o 0.");
      return fallBack();
    }

    // Recuperar los datos del pernil grande del estado
    const currentState = await state.getMyState();


    // Verificar que tengamos la información necesaria
    if (!currentState || !currentState.baseItem) {
      await flowDynamic(
        "⚠️ Hubo un problema con tu selección. Volviendo al menú principal."
      );
      return gotoFlow(flowPrincipal);
    }

    const { baseItem, basePrice, baseIncluye } = currentState;

    // Procesar la respuesta
    let finalItem = baseItem;
    let finalPrice = basePrice;
    let finalIncluye = baseIncluye;

    if (resp === "1") {
      finalItem += " fileteado";
      finalPrice += 10000;
      finalIncluye += " + servicio de fileteado";
    } else {
    }

    // Actualizar el estado con la información final del producto
    await state.update({
      itemParaCantidad: {
        category: "Pernil",
        item: finalItem,
        price: finalPrice,
        incluye: finalIncluye,
      },
    });

    // Confirmar la selección al usuario
    await flowDynamic(`✅ Perfecto, has seleccionado *${finalItem}*.`);

   
    // Ir al flujo de cantidad
    return gotoFlow(flowCantidad);
  }
);

module.exports = flowFileteado;
