const { addKeyword } = require('@bot-whatsapp/bot')

module.exports = addKeyword('cancelar')
    .addAnswer('⚠️ *Pedido cancelado*')
    .addAnswer('Puedes volver a iniciar escribiendo *menu*')