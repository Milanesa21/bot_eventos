// utils/resetPedido.js
const resetPedido = (state) => {
  state.update({
    pedidoActual: {
      cart: [],
      customerData: {
        phone: null,
        date: null,
        address: null,
        comments: null,
      },
    },
  });
};

const getPedidoActual = (state) => {
  const currentState = state.getMyState();
  return (
    currentState?.pedidoActual || {
      // Usamos optional chaining
      cart: [],
      customerData: {
        phone: null,
        date: null,
        address: null,
        comments: null,
      },
    }
  );
};

module.exports = { resetPedido, getPedidoActual };
