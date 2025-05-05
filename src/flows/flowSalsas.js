// flows/flowSalsas.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowCantidad = require("./flowCantidad");

const variedades = [
  "Mayonesa de ajo y albahaca",
  "Mayonesa de aceitunas",
  "Mayonesa de choclo",
  "Mayonesa de orégano",
  "Roquefort a la crema",
  "Mayonesa de ajo",
  "Mayonesa de morrón",
  "Mayonesa de albahaca",
  "Mayonesa de chimichurri",
  "Mayonesa de verdeo",
  "Mayonesa de perejil",
  "Mostaza",
  "Ketchup",
  "Salsa golf",
  "Salsa criolla",
];

const mensajeVariedades = [
  "🥫 *Elige la variedad de Salsa*",
  "",
  ...variedades.map((v, i) => `${i + 1}️⃣ ${v}`),
  "",
  "0️⃣ Cancelar y volver al menú principal",
  "",
  "Responde con el número de tu elección.",
].join("\n");

const mensajeTamaños = [
  "📏 *Elige el tamaño*",
  "",
  "1️⃣ Chica — $6.500",
  "2️⃣ Grande — $7.500",
  "",
  "0️⃣ Cancelar y volver al menú principal",
  "",
  "Responde con el número de tu elección.",
].join("\n");

const flowSalsas = addKeyword(EVENTS.ACTION)
  // PASO 1: Selección de variedad
  .addAnswer(
    mensajeVariedades,
    { capture: true },
    async (ctx, { flowDynamic, fallBack, state, gotoFlow }) => {
      const opt = ctx.body.trim();
      if (opt === "0") {
        return gotoFlow(require("./flowPrincipal"));
      }
      const idx = parseInt(opt, 10);
      if (isNaN(idx) || idx < 1 || idx > variedades.length) {
        await flowDynamic(
          `❌ Opción no válida. Ingresa un número entre 1 y ${variedades.length}, o 0 para cancelar.`
        );
        return fallBack();
      }
      const variedad = variedades[idx - 1];
      await state.update({ variedad });
      // Pasamos al siguiente addAnswer (tamaño)
    }
  )
  // PASO 2: Selección de tamaño y delegación a flowCantidad
  .addAnswer(
    mensajeTamaños,
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
      const opt = ctx.body.trim();
      if (opt === "0") {
        await state.clear();
        return gotoFlow(require("./flowPrincipal"));
      }
      if (!["1", "2"].includes(opt)) {
        await flowDynamic(
          "❌ Opción no válida. Por favor selecciona 1 (Chica), 2 (Grande) o 0 para cancelar."
        );
        return fallBack();
      }

      const { variedad } = await state.getMyState();
      if (!variedad) {
        // Por seguridad, si no tenemos variedad, reiniciamos
        await flowDynamic(
          "⚠️ Algo falló al procesar tu selección. Intenta de nuevo desde el menú."
        );
        return gotoFlow(require("./flowPrincipal"));
      }

      // Datos según tamaño
      const sizeName = opt === "1" ? "Chica" : "Grande";
      const unitPrice = opt === "1" ? 5500 : 7500;

      const selectedItemData = {
        category: "Salsas",
        item: `${variedad} (${sizeName})`,
        price: unitPrice,
        incluye: `Salsa ${sizeName.toLowerCase()}`,
      };

      // Guardamos el ítem completo para que flowCantidad pregunte la cantidad
      await state.update({ itemParaCantidad: selectedItemData });

      // Y delegamos a flowCantidad
      return gotoFlow(flowCantidad);
    }
  );

module.exports = flowSalsas;
