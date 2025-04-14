const { addKeyword } = require('@bot-whatsapp/bot')
const { resetPedido } = require('../helpers/estadoPedido')

module.exports = addKeyword(['hola', 'menu', 'pedido', 'volver'])
    .addAction(async (_, { state, endFlow }) => {
        await resetPedido(state)
        const enConsulta = await state.get('enConsulta')
        if (enConsulta) return endFlow()
    })
    .addAnswer('¡Bienvenido a Angelica Perniles! 🎉')
    .addAnswer(
        '¿Qué deseas hacer hoy?\n\n' +
        '1. Menú para Eventos Infantiles\n' +
        '2. Menú para Otros Eventos\n' +
        '3. Hacer una consulta\n' +
        { capture: true },
        async (ctx, { gotoFlow }) => {
            const opcion = ctx.body.trim()
            switch(opcion) {
                case '1': return gotoFlow(require('./flowMenuInfantil'))
                case '2': return gotoFlow(require('./flowMenuEventos'))
                case '3': return gotoFlow(require('./flowConsulta'))
                default: return gotoFlow(this)
            }
        }
    )