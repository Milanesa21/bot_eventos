const { addKeyword } = require('@bot-whatsapp/bot')

const flowDatosCliente = addKeyword('datos')
    .addAnswer(
        'Bienvenido a la agenda de pedidos de nuestra cadena de eventos.\n\n' +
        'Para comenzar, por favor ingresa tu *nombre completo*.\n' +
        'Ejemplo: "Juan Pérez"',
        { capture: true },
        async (ctx, { gotoFlow, state, fallBack }) => {
            const name = ctx.body.trim()
            if (!name) {
                return fallBack('No se detectó ningún nombre. Por favor ingresa tu nombre completo.')
            }
            // Guarda el nombre en el estado
            await state.set('clienteData', { name })
            // Dirige al siguiente flujo: solicitar teléfono
            return gotoFlow(require('./flowTelefono'))
        }
    )

module.exports = flowDatosCliente
