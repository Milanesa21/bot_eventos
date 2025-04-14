const { addKeyword } = require('@bot-whatsapp/bot')

const flowTelefono = addKeyword('telefono')
    .addAnswer(
        'Gracias, ya tenemos tu nombre.\n\n' +
        'Ahora, por favor ingresa tu *número de teléfono*, incluyendo el código de área.\n' +
        'Ejemplo: "+1234567890"',
        { capture: true },
        async (ctx, { gotoFlow, state, fallBack }) => {
            const phone = ctx.body.trim()
            // Validación simple: debe ser solo dígitos y opcionalmente iniciar con el signo "+"
            if (!phone || !/^\+?\d+$/.test(phone)) {
                return fallBack('El número ingresado no es válido. Asegúrate de incluir solo dígitos y el signo "+" al inicio si es necesario.')
            }
            // Actualiza el objeto clienteData con el teléfono
            let clienteData = await state.get('clienteData') || {}
            clienteData.phone = phone
            await state.set('clienteData', clienteData)
            // Continúa al siguiente flujo: solicitar correo electrónico
            return gotoFlow(require('./flowEmail'))
        }
    )

module.exports = flowTelefono
