// flows/flowWelcome.js
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
// Importar flowPrincipal al inicio del archivo
const flowPrincipal = require("./flowPrincipal");

const flowWelcome = addKeyword(EVENTS.WELCOME).addAnswer(
  "👋 ¡Hola! Bienvenido a *Angélica Perniles*",
  null, // No necesitamos capturar respuesta aquí
  async (_, { gotoFlow, flowDynamic }) => {
    // El saludo ya se envió con el addAnswer.
    // Ahora, inmediatamente intentamos ir al flowPrincipal.
    try {
      // Verificación simple (aunque importar arriba ya debería asegurar esto)
      if (!flowPrincipal) {
        console.error(
          "Error crítico: flowPrincipal no se cargó correctamente al inicio."
        );
        await flowDynamic(
          "⚠️ Error interno del bot. No se pudo cargar el menú principal."
        );
        return; // Detiene la ejecución si hay un problema grave
      }
      // La forma estándar y segura de cambiar de flujo
      return gotoFlow(flowPrincipal);
    } catch (error) {
      // Captura cualquier error que pudiera ocurrir durante la transición
      console.error(
        "Error al intentar ir a flowPrincipal desde flowWelcome:",
        error
      );
      await flowDynamic(
        "⚠️ Hubo un problema al iniciar el menú. Por favor, intenta escribir 'hola' o 'menu'."
      );
    }
  }
);

module.exports = flowWelcome;
