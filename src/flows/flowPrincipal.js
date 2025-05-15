// flows/flowPrincipal.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getPedidoActual } = require("../utils/resetPedido"); // No necesitas resetPedido aquí

// ... (importaciones de otros flujos como flowPernil, flowTernera, etc.)
const flowPernil = require("./flowPernil");
const flowTernera = require("./flowTernera");
const flowBondiola = require("./flowBondiola");
const flowSalsas = require("./flowSalsas");
const flowComboPernil = require("./flowComboPernil");
const flowComboTernera = require("./flowComboTernera");
const flowSoloMinutas = require("./flowSoloMinutas");
const flowBoxChips = require("./flowBoxChips");
const flowMenuKids = require("./flowMenuKids");
const flowPanaderia = require("./flowPanaderia");
const flowConsulta = require("./flowConsulta");

const opcionesMenu = [
  "1️⃣ Pernil",
  "2️⃣ Pata de ternera / Peceto/Vitel Toné",
  "3️⃣ Bondiola",
  "4️⃣ Salsas",
  "5️⃣ Combo Pernil + Minutas",
  "6️⃣ Combo Ternera + Minutas",
  "7️⃣ Solo Minutas",
  "8️⃣ Box de Chips y Combo EXPRESS",
  "9️⃣ Menú Kids",
  "🔟 Panadería",
  "0️⃣ Consultar con el chef",
  "",
  "Por favor, Responde con el número de tu elección. 😊",
];

const mensajeError = [
  // Asegúrate de que este mensaje de error también esté actualizado si cambiaste el menú
  "❌ *Opción no válida.* Por favor selecciona:",
  "",
  "1️⃣ Pernil",
  "2️⃣ Pata de ternera / Peceto/Vitel Toné", // Ajustado para coincidir
  "3️⃣ Bondiola",
  "4️⃣ Salsas",
  "5️⃣ Combo Pernil + Minutas",
  "6️⃣ Combo Ternera + Minutas",
  "7️⃣ Solo Minutas",
  "8️⃣ Box de Chips y Combo EXPRESS", // Ajustado para coincidir
  "9️⃣ Menú Kids",
  "🔟 Panadería",
  "0️⃣ Consultar con el chef",
].join("\n");

const flowPrincipal = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Qué te gustaría ordenar hoy? 🤔")
  .addAnswer(
    opcionesMenu.join("\n"),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic, fallBack, state }) => {
      const respuesta = ctx.body.trim();

      const updateTipo = async (
        tipoCategoriaSeleccionada,
        flowDestino,
        mensajeConfirmacion
      ) => {
        const pedidoActualRecuperado = await getPedidoActual(state);

        const nuevoEstadoPedido = {
          ...pedidoActualRecuperado,
          tipo: tipoCategoriaSeleccionada,
        };

        await state.update({ pedidoActual: nuevoEstadoPedido });
        await flowDynamic(mensajeConfirmacion);
        return gotoFlow(flowDestino);
      };

      switch (respuesta) {
        case "1":
          return updateTipo(
            "Pernil",
            flowPernil,
            "➡️ Has seleccionado *Pernil*"
          );
        case "2":
          return updateTipo(
            "Ternera / Peceto",
            flowTernera,
            "➡️ Has seleccionado *Ternera / Peceto*"
          );
        case "3":
          return updateTipo(
            "Bondiola",
            flowBondiola,
            "➡️ Has seleccionado *Bondiola*"
          );
        case "4":
          return updateTipo(
            "Salsas",
            flowSalsas,
            "➡️ Has seleccionado *Salsas*"
          );
        case "5":
          return updateTipo(
            "Combo Pernil + Minutas",
            flowComboPernil,
            "➡️ Has seleccionado *Combo Pernil + Minutas*"
          );
        case "6":
          return updateTipo(
            "Combo Ternera + Minutas",
            flowComboTernera,
            "➡️ Has seleccionado *Combo Ternera + Minutas*"
          );
        case "7":
          return updateTipo(
            "Solo Minutas",
            flowSoloMinutas,
            "➡️ Has seleccionado *Solo Minutas*"
          );
        case "8":
          return updateTipo(
            "Box de Chips / EXPRESS",
            flowBoxChips,
            "➡️ Has seleccionado *Box de Chips / EXPRESS*"
          );
        case "9":
          return updateTipo(
            "Menú Kids",
            flowMenuKids,
            "➡️ Has seleccionado *Menú Kids*"
          );
        case "10":
        case "p": // Asumiendo que 'p' es un alias para panadería
          return updateTipo(
            "Panadería",
            flowPanaderia,
            "➡️ Has seleccionado *Panadería*"
          );
        case "0":
          await flowDynamic("➡️ Te paso con el chef para consultas");
          return gotoFlow(flowConsulta);
        default:
          return fallBack(mensajeError);
      }
    }
  );

module.exports = flowPrincipal;
