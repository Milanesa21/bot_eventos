// utils/resetPedido.js
const resetPedido = async (state) => {
  await state.update({
    pedidoActual: {
      cart: [],
      customerData: {
        name: null,
        phone: null,
        date: null,
        time: null,
        address: null,
        comments: null,
      },
    },
  });
};

const getPedidoActual = async (state) => {
  const currentState = await state.getMyState();
  return (
    currentState?.pedidoActual || {
      cart: [],
      customerData: {
        name: null,
        phone: null,
        date: null,
        time: null,
        address: null,
        comments: null,
      },
    }
  );
};

module.exports = { resetPedido, getPedidoActual };