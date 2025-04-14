const { addKeyword } = require('@bot-whatsapp/bot')

module.exports = addKeyword('confirmar')
    .addAnswer('✅ *Pedido confirmado con éxito!*')
    .addAnswer('Gracias por elegir a Angelica Perniles 🎉')
    .addAnswer('Nos estaremos comunicando contigo para coordinar la entrega.')