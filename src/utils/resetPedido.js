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
      tipo: null, // Es bueno tenerlo aquí también
    },
  });
};

const getPedidoActual = async (state) => {
  const currentState = await state.getMyState();
  const defaults = {
    cart: [],
    customerData: {
      name: null,
      phone: null,
      date: null,
      time: null,
      address: null,
      comments: null,
    },
    tipo: null, // Valor por defecto para tipo
  };

  const merged = {
    ...defaults, // Primero los valores por defecto
    ...(currentState?.pedidoActual || {}), // Luego se esparce el estado actual, sobrescribiendo los defaults si existen propiedades
  };
  return merged;
};

module.exports = { resetPedido, getPedidoActual };
