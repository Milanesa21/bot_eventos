module.exports = {
    resetPedido: async (state) => {
        await state.update({
            pedido: [],
            enConsulta: false,
            menuActual: null,
            datosCliente: null
        })
    },
    agregarAlPedido: async (seleccion, state, items) => {
        const item = items[seleccion]
        if (item) {
            const pedido = await state.get('pedido') || []
            const existente = pedido.find(p => p.nombre === item.nombre)
            
            if (existente) {
                existente.cantidad++
            } else {
                pedido.push({ ...item, cantidad: 1 })
            }
            
            await state.update({ 
                pedido,
                menuActual: 'infantil'
            })
        }
    }
}