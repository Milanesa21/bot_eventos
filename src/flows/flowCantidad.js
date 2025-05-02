// flows/flowCantidad.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { pedidoActual } = require("../utils/resetPedido"); // Asumiendo que solo necesitas esto

const flowCantidad = addKeyword(EVENTS.ACTION)
  // Usamos addAction para verificar el estado ANTES de preguntar
  .addAction(async (_, { state, flowDynamic, gotoFlow }) => {
    const currentState = await state.getMyState();
    // Verifica si el item fue pasado correctamente en el estado
    if (!currentState || !currentState.itemParaCantidad) {
      console.error(
        "ERROR en flowCantidad: No se encontró 'itemParaCantidad' en el estado."
      );
      await flowDynamic(
        "⚠️ Hubo un problema al seleccionar el producto. Por favor, intenta de nuevo desde el menú principal."
      );
      return gotoFlow(require("./flowPrincipal")); // Vuelve al inicio si hay error
    }
    // Si todo está bien, el addAction simplemente termina y pasa al addAnswer
  })
  // Ahora sí, preguntamos la cantidad
  .addAnswer(
    // Hacemos la pregunta un poco más genérica ya que no podemos poner el nombre del item aquí fácilmente
    [
      "🔢 ¿Cuántas unidades de este producto deseas agregar?",
      "",
      "Ingresa un número positivo (ej: 1, 2, 3...)",
      "0️⃣ para Cancelar y volver al menú",
    ].join("\n"),
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
      const cantidadStr = ctx.body.trim();

      // Opción 0: Cancelar
      if (cantidadStr === "0") {
        await state.clear(); // Limpiamos estado antes de cancelar
        await flowDynamic("Operación cancelada.");
        return gotoFlow(require("./flowPrincipal"));
      }

      const cantidad = parseInt(cantidadStr, 10);
      const currentState = await state.getMyState(); // Recuperamos los datos del item

      // Re-verificamos el estado por seguridad
      if (!currentState || !currentState.itemParaCantidad) {
        console.error(
          "ERROR en flowCantidad (callback): No se encontró 'itemParaCantidad' en el estado."
        );
        await flowDynamic("⚠️ Hubo un problema. Por favor, intenta de nuevo.");
        await state.clear();
        return gotoFlow(require("./flowPrincipal"));
      }

      // Validar cantidad numérica y positiva
      if (isNaN(cantidad) || cantidad <= 0) {
        // Podemos opcionalmente recordar qué item estaban seleccionando
        const itemName =
          currentState.itemParaCantidad.item || "el producto seleccionado";
        await flowDynamic(
          `❌ Cantidad no válida para "${itemName}".\nPor favor, ingresa un número positivo (1, 2...) o 0 para cancelar.`
        );
        return fallBack(); // Vuelve a preguntar la cantidad
      }

      // Extraemos los detalles del item guardado en el estado
      const { item, price, incluye, category } = currentState.itemParaCantidad;

      // Agregamos el item al carrito 'cantidad' veces
      for (let i = 0; i < cantidad; i++) {
        pedidoActual.cart.push({
          category,
          item,
          price,
          // Solo añadimos 'incluye' si existe en el objeto original
          ...(incluye && { incluye }), // Sintaxis spread condicional
        });
      }

      // Mensaje de confirmación
      const precioTotalItems = price * cantidad;
      await flowDynamic(
        [
          `✅ *${cantidad} x ${item}* agregado(s) al pedido.`,
          // Opcional: Mostrar qué incluye si aplica
          // incluye ? `   Cada uno incluye: ${incluye}` : '',
          `💵 Subtotal por este/os item(s): $${precioTotalItems.toLocaleString(
            "es-AR"
          )}`,
        ]
          .filter(Boolean)
          .join("\n") // filter(Boolean) elimina líneas vacías si 'incluye' no existe
      );

      // Limpiamos el estado AHORA que terminamos con este item específico
      await state.clear();
      // O, si necesitas mantener otros datos en state:
      // await state.update({ itemParaCantidad: undefined });

      // Vamos al flujo estándar para seguir comprando o finalizar
      return gotoFlow(require("./flowAgregarItems"));
    }
  );

module.exports = flowCantidad;
