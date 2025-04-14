const { addKeyword } = require('@bot-whatsapp/bot')

const flowEmail = addKeyword('email')
    .addAnswer(
        'Perfecto, ya contamos con tu nombre y teléfono.\n\n' +
        'Por último, ingresa tu *dirección de correo electrónico*.\n' +
        'Ejemplo: "usuario@dominio.com"',
        { capture: true },
        async (ctx, { gotoFlow, state, fallBack }) => {
            const email = ctx.body.trim()
            // Validación básica del formato de correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!email || !emailRegex.test(email)) {
                return fallBack('La dirección de correo electrónico no parece válida. Por favor, ingrésala en el formato correcto (ejemplo: usuario@dominio.com).')
            }
            // Agrega el correo al objeto clienteData
            let clienteData = await state.get('clienteData') || {}
            clienteData.email = email
            await state.set('clienteData', clienteData)
            // Dirige al flujo de confirmación de datos
            return gotoFlow(require('./flowConfirmacionDatos'))
        }
    )

module.exports = flowEmail
