const { addKeyword } = require('@bot-whatsapp/bot')

module.exports = addKeyword('consulta')
    .addAnswer('📩 *Departamento de consultas*')
    .addAnswer('Por favor describe tu consulta y te responderemos a la brevedad')
    .addAnswer('(Escribe tu mensaje y nuestro equipo te contactará)')
    .addAction(async (_, { state }) => {
        await state.update({ enConsulta: true })
    })