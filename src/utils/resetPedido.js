// utils/resetPedido.js
let pedidoActual = {
  cart: [], // aquí guardas los ítems (igual que session.cart)
  customerData: {
    // igual que session.customerData
    phone: null,
    date: null,
    address: null,
    comments: null,
  },
};

const resetPedido = () => {
  pedidoActual.cart = [];
  pedidoActual.customerData = {
    phone: null,
    date: null,
    address: null,
    comments: null,
  };
};

module.exports = { pedidoActual, resetPedido };
