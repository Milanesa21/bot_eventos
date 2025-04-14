const { addKeyword } = require('@bot-whatsapp/bot')
const { resetPedido } = require('../helpers/estadoPedido')

const flowConfirmacionDatos = addKeyword('confirmarDatos')
    .addAnswer(
        async (ctx, { state }) => {
            const clienteData = await state.get('clienteData') || {}
            return 'Por favor, confirma que los siguientes datos son correctos:\n\n' +
                   `*Nombre:* ${clienteData.name}\n` +
                   `*Teléfono:* ${clienteData.phone}\n` +
                   `*Correo:* ${clienteData.email}\n\n` +
                   'Si la información es correcta, responde con *"confirmar"*.\n' +
                   'Si deseas realizar cambios, responde con *"editar"*.'
        },
        { capture: true },
        async (ctx, { gotoFlow, state }) => {
            const input = ctx.body.trim().toLowerCase()
            if (input === 'editar') {
                // Reinicia la información del pedido
                await resetPedido(state)
                return gotoFlow(require('./flowDatosCliente'))
            }
            if (input === 'confirmar') {
                // Continua al flujo de confirmación final o siguiente paso (asegúrate de crear el archivo flowConfirmacion.js)
                return gotoFlow(require('./flowConfirmacion'))
            }
            // Si la respuesta no es válida, se vuelve a solicitar la confirmación
            return gotoFlow(require('./flowConfirmacionDatos'))
        }
    )

module.exports = flowConfirmacionDatos
