// app.js
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

// Importar flujos
const flowPrincipal = require("./flows/flowPrincipal");
const flowAgregarItems = require("./flows/flowAgregarItems");
const flowPernil = require("./flows/flowPernil");
const flowTernera = require("./flows/flowTernera");
const flowBondiola = require("./flows/flowBondiola");
const flowSalsas = require("./flows/flowSalsas");
const flowComboPernil = require("./flows/flowComboPernil");
const flowComboTernera = require("./flows/flowComboTernera");
const flowSoloMinutas = require("./flows/flowSoloMinutas");
const flowBoxChips = require("./flows/flowBoxChips");
const flowMenuKids = require("./flows/flowMenuKids");
const flowPanaderia = require("./flows/flowPanaderia");
const flowDatosCliente = require("./flows/flowDatosCliente");
const flowConfirmacion = require("./flows/flowConfirmacion");
const flowConsulta = require("./flows/flowConsulta");
const flowWelcome = require("./flows/flowWelcome")
const flowFechaEvento = require("./flows/flowFechaEvento")
const flowDireccionEntrega = require("./flows/flowDireccionEntrega")
const flowComentarios = require("./flows/flowComentarios");
const flowCantidad = require("./flows/flowCantidad")
const flowPago = require("./flows/flowPago")
const flowFileteado = require("./flows/flowFileteado")


async function main() {
  // Base de datos en memoria
  const adapterDB = new MockAdapter();

  // Crear el flujo maestro
  const adapterFlow = createFlow([
    flowPrincipal,
    flowAgregarItems,
    flowPernil,
    flowTernera,
    flowBondiola,
    flowSalsas,
    flowComboPernil,
    flowComboTernera,
    flowSoloMinutas,
    flowBoxChips,
    flowMenuKids,
    flowPanaderia,
    flowDatosCliente,
    flowConfirmacion,
    flowConsulta,
    flowWelcome,
    flowFechaEvento,
    flowDireccionEntrega,
    flowComentarios,
    flowCantidad,
    flowPago,
    flowFileteado,
  ]);

  // Proveedor de WhatsApp
  const adapterProvider = createProvider(BaileysProvider);

  // Crear bot
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  // Mostrar QR en navegador
  QRPortalWeb();
}

main();
