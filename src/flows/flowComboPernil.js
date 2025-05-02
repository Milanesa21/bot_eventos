// flows/flowComboPernil.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importamos el nuevo flujo
const flowCantidad = require("./flowCantidad");

const flowComboPernil = addKeyword(EVENTS.ACTION)
  // --- PASO ÚNICO: Elegir el tipo de Combo y pasar a flowCantidad ---
  .addAnswer(
    [
      "🍖🥐 *Combo Pernil + Minutas*",
      "",
      "1️⃣ Combo Pernil (50 pers) - Incluye: 1 Pernil + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches (~$350.000)",
      "2️⃣ Combo Pernil (70 pers) - Incluye: 1 Pernil + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches (~$490.000)",
      "3️⃣ Combo Pernil (100 pers) - Incluye: 1 Pernil + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches (~$770.000)",
      "0️⃣ Cancelar",
      "",
      "Responde con el número de tu elección.",
    ].join("\n"),
    { capture: true },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
      const opt = ctx.body.trim();

      if (opt === "0") {
        return gotoFlow(require("./flowPrincipal"));
      }

      let selectedComboData; // Cambiamos el nombre para claridad
      switch (opt) {
        case "1":
          selectedComboData = {
            item: "Combo Pernil (50 pers)",
            price: 350000,
            incluye:
              "1 Pernil + 24 empanadas, 24 chips, 24 pizzetas, 24 sándwiches",
            category: "Combo Pernil",
          };
          break;
        case "2":
          selectedComboData = {
            item: "Combo Pernil (70 pers)",
            price: 490000,
            incluye:
              "1 Pernil + 48 empanadas, 48 chips, 48 pizzetas, 48 sándwiches",
            category: "Combo Pernil",
          };
          break;
        case "3":
          selectedComboData = {
            item: "Combo Pernil (100 pers)",
            price: 770000,
            incluye:
              "1 Pernil + 96 empanadas, 96 chips, 96 pizzetas, 96 sándwiches",
            category: "Combo Pernil",
          };
          break;
        default:
          await flowDynamic("❌ Opción no válida. Por favor responde 1-3 o 0.");
          return fallBack(); // Repite la pregunta
      }

      // Guardamos los datos del combo seleccionado en el estado
      // Usando la clave 'itemParaCantidad' que espera flowCantidad
      await state.update({ itemParaCantidad: selectedComboData });

      // Redirigimos al flujo de cantidad
      return gotoFlow(flowCantidad);
    }
  );

module.exports = flowComboPernil;
