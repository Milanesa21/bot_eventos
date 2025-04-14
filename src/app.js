const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// Importar todos los flujos, incluidos los nuevos de datos del cliente
const flowPrincipal = require('./flows/flowPrincipal')
const flowMenuInfantil = require('./flows/flowMenuInfantil')
const flowMenuEventos = require('./flows/flowMenuEventos')
const flowAgregarItems = require('./flows/flowAgregarItems')
const flowDatosCliente = require('./flows/flowDatosCliente')
const flowTelefono = require('./flows/flowTelefono')
const flowEmail = require('./flows/flowEmail')
const flowConfirmacionDatos = require('./flows/flowConfirmacionDatos')
const flowConfirmacion = require('./flows/flowConfirmacion')
const flowCancelar = require('./flows/flowCancelar')
const flowConsulta = require('./flows/flowConsulta')

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        flowPrincipal,
        flowMenuInfantil,
        flowMenuEventos,
        flowAgregarItems,
        flowDatosCliente,
        flowTelefono,
        flowEmail,
        flowConfirmacionDatos,
        flowConfirmacion,
        flowCancelar,
        flowConsulta
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
