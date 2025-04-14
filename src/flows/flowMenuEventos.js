const { addKeyword } = require('@bot-whatsapp/bot')
const { agregarAlPedido } = require('../helpers/estadoPedido')

const menuEventos = {
    titulo: '🍖 *Menú Eventos*',
    items: {
        '1': { nombre: 'Pernil', precio: 25000 },
        '2': { nombre: 'Carne Asada', precio: 30000 },
        '3': { nombre: 'Ensalada Fresca', precio: 15000 },
        '4': { nombre: 'Bebida 500ml', precio: 5000 },
        '5': { nombre: 'Arroz Especial', precio: 12000 }
    }
}

module.exports = addKeyword('2')
    .addAnswer(
        `${menuEventos.titulo}:\n` +
        Object.entries(menuEventos.items)
            .map(([key, item]) => `${key}. ${item.nombre} - $${item.precio.toLocaleString()}`)
            .join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, state }) => {
            await agregarAlPedido(ctx.body, state, menuEventos.items)
            return gotoFlow(require('./flowAgregarItems'))
        }
    )
