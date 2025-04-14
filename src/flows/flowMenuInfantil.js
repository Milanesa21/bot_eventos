const { addKeyword } = require('@bot-whatsapp/bot')
const { agregarAlPedido } = require('../helpers/estadoPedido')

const menuInfantil = {
    titulo: '🍕 *Menú Infantil*',
    items: {
        '1': { nombre: 'Pizza', precio: 10000 },
        '2': { nombre: 'Mini Hamburguesas', precio: 12000 },
        '3': { nombre: 'Papas Fritas', precio: 8000 },
        '4': { nombre: 'Jugo 500ml', precio: 3000 }
    }
}

module.exports = addKeyword('1')
    .addAnswer(
        `${menuInfantil.titulo}:\n` +
        Object.entries(menuInfantil.items).map(([key, item]) => 
            `${key}. ${item.nombre} - $${item.precio.toLocaleString()}`
        ).join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, state }) => {
            await agregarAlPedido(ctx.body, state, menuInfantil.items)
            return gotoFlow(require('./flowAgregarItems'))
        }
    )