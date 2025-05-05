// flows/flowPrincipal.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Asegúrate que resetPedido NO se necesita aquí si no vas a resetear el pedido al inicio de este flujo
// const { resetPedido, pedidoActual } = require("../utils/resetPedido");
// Si solo necesitas pedidoActual, impórtalo así:
const { pedidoActual } = require("../utils/resetPedido");

// Importaciones de los flujos secundarios
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

// Lista de opciones para mostrar al usuario (actualizada)
const opcionesMenu = [
  "1️⃣ Pernil",
  "2️⃣ Pata de ternera / (borrar paleta) / Peceto/Vitel Toné", // Era 3
  "3️⃣ Bondiola", // Era 4
  "4️⃣ Salsas", // Era 5
  "5️⃣ Combo Pernil + Minutas", // Era 6
  "6️⃣ Combo Ternera + Minutas", // Era 7
  "7️⃣ Solo Minutas", // Era 8
  "8️⃣ Box de Chips y Combo EXPRESS", // Era 9
  "9️⃣ Menú Kids", // Era 10
  "🔟 Panadería", // Era P
  "0️⃣ Consultar con el chef",
  "",
  "Por favor, seleccione el numero de lo que quiera solicitar. 😊",
];

// Mensaje de fallback/error (actualizado)
const mensajeError = [
  "❌ *Opción no válida.* Por favor selecciona:",
  "",
  "1️⃣ Pernil",
  "2️⃣ Pata de ternera / (borrar paleta) / Peceto",
  "3️⃣ Bondiola",
  "4️⃣ Salsas",
  "5️⃣ Combo Pernil + Minutas",
  "6️⃣ Combo Ternera + Minutas",
  "7️⃣ Solo Minutas",
  "8️⃣ Box Chips / EXPRESS",
  "9️⃣ Menú Kids",
  "🔟 Panadería",
  "0️⃣ Consultar con el chef",
].join("\n");

const flowPrincipal = addKeyword(EVENTS.ACTION)
  // 2) Pregunta qué quiere hacer
  .addAnswer("¿Qué te gustaría ordenar hoy? 🤔")
  // 3) Muestra opciones (actualizadas) y captura
  .addAnswer(
    opcionesMenu.join("\n"),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
      // Usamos trim() para quitar espacios y comparamos estrictamente
      const respuesta = ctx.body.trim();

      // Reordenamos los 'if' para que coincidan con la nueva numeración
      // Es más seguro usar '===' en lugar de 'includes()' para evitar errores (ej: "10" incluye "1")
      if (respuesta === "1") {
        pedidoActual.tipo = "Pernil";
        await flowDynamic("➡️ Has seleccionado *Pernil*");
        return gotoFlow(flowPernil);
      }
      if (respuesta === "2") {
        // Era 3
        pedidoActual.tipo = "Ternera / (borrar paleta) / Peceto";
        await flowDynamic(
          "➡️ Has seleccionado *Ternera / (borrar paleta) / Peceto*"
        );
        return gotoFlow(flowTernera);
      }
      if (respuesta === "3") {
        // Era 4
        pedidoActual.tipo = "Bondiola";
        await flowDynamic("➡️ Has seleccionado *Bondiola*");
        return gotoFlow(flowBondiola);
      }
      if (respuesta === "4") {
        // Era 5
        pedidoActual.tipo = "Salsas";
        await flowDynamic("➡️ Has seleccionado *Salsas*");
        return gotoFlow(flowSalsas);
      }
      if (respuesta === "5") {
        // Era 6
        pedidoActual.tipo = "Combo Pernil + Minutas";
        await flowDynamic("➡️ Has seleccionado *Combo Pernil + Minutas*");
        return gotoFlow(flowComboPernil);
      }
      if (respuesta === "6") {
        // Era 7
        pedidoActual.tipo = "Combo Ternera + Minutas";
        await flowDynamic("➡️ Has seleccionado *Combo Ternera + Minutas*");
        return gotoFlow(flowComboTernera);
      }
      if (respuesta === "7") {
        // Era 8
        pedidoActual.tipo = "Solo Minutas";
        await flowDynamic("➡️ Has seleccionado *Solo Minutas*");
        return gotoFlow(flowSoloMinutas);
      }
      if (respuesta === "8") {
        // Era 9
        pedidoActual.tipo = "Box de Chips / EXPRESS";
        await flowDynamic("➡️ Has seleccionado *Box de Chips / EXPRESS*");
        return gotoFlow(flowBoxChips);
      }
      if (respuesta === "9") {
        // Era 10
        pedidoActual.tipo = "Menú Kids";
        await flowDynamic("➡️ Has seleccionado *Menú Kids*");
        return gotoFlow(flowMenuKids);
      }
      if (respuesta === "10" || respuesta.toLowerCase() === "p") {
        // Era P, ahora 10. Aceptamos 'p' por si acaso.
        pedidoActual.tipo = "Panadería";
        await flowDynamic("➡️ Has seleccionado *Panadería*");
        return gotoFlow(flowPanaderia);
      }
      if (respuesta === "0") {
        await flowDynamic("➡️ Te paso con el chef para consultas");
        return gotoFlow(flowConsulta);
      }

      // Si ninguna opción coincide, muestra el mensaje de error actualizado
      return fallBack(mensajeError);
    }
  );

module.exports = flowPrincipal;
