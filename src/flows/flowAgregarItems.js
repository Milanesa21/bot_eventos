const { addKeyword } = require('@bot-whatsapp/bot')
const { resetPedido } = require('../helpers/estadoPedido')

const flowAgregarItems = addKeyword('agregar')
    .addAnswer(
        '¿Qué deseas hacer ahora?\n\n' +
        '1. Agregar otro producto\n' +
        '2. Ver otros menús\n' +
        '3. Finalizar pedido\n' +
        '4. Volver al inicio',
        { capture: true },
        async (ctx, { gotoFlow, state }) => {
            const opcion = ctx.body.trim()
            
            const MenuInfantil = require('./flowMenuInfantil')
            const MenuEventos = require('./flowMenuEventos')
            const Principal = require('./flowPrincipal')
            const DatosCliente = require('./flowDatosCliente')
            
            switch(opcion) {
                case '1': {
                    const menuActual = await state.get('menuActual')
                    return gotoFlow(menuActual === 'infantil' ? MenuInfantil : MenuEventos)
                }
                
                case '2':
                    return gotoFlow(Principal)
                
                case '3':
                    return gotoFlow(DatosCliente)
                
                case '4':
                    await resetPedido(state)
                    return gotoFlow(Principal)
                
                default:
                    return gotoFlow(flowAgregarItems)
            }
        }
    )

module.exports = flowAgregarItems