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
      seguroTabla: null, // Nuevo campo añadido con valor predeterminado null
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
    seguroTabla: null, // Nuevo campo añadido con valor predeterminado null
  };

  // Primero los valores por defecto
  // Luego se esparce el estado actual, sobrescribiendo los defaults si existen propiedades
  // Finalmente, se asegura de que customerData exista y se mezcla con sus defaults si es necesario
  const merged = {
    ...defaults,
    ...(currentState?.pedidoActual || {}),
    customerData: {
      ...defaults.customerData, // Asegura los defaults de customerData
      ...(currentState?.pedidoActual?.customerData || {}), // Sobrescribe con los datos del cliente del estado si existen
    },
  };

  // Asegurarse de que seguroTabla siempre exista, usando el default si no está en el estado
  if (merged.seguroTabla === undefined) {
    merged.seguroTabla = defaults.seguroTabla; // Asigna null si no estaba definido
  }

  return merged;
};

module.exports = { resetPedido, getPedidoActual };
