const postToCart = async (code, carrito) => {
  try {
    const response = await fetch(`/api/cart/${carrito}/product/${code}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function addToCart(code) {
  const lsCartId = localStorage.getItem("cartId");
  let cart;
  if (!lsCartId) {
    const response = await fetch("/api/cart/newCart", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    cart = await response.json();
    localStorage.setItem("cartId", cart.cart[0]._id);
  }
  const response = await postToCart(code, cart ? cart.cart[0]._id : lsCartId);
  // Después de agregar el producto, actualiza el DOM con el nuevo subtotal
  const product = cartProducts.find((product) => product.code === code);
  const subtotalElement = document.getElementById("subtotal");
  subtotalElement.innerText = `Subtotal: ${calculateSubtotal(product)}`;
  if (response.status === 200) {
    alert("Producto agregado al carrito");
  }
}
const deleteProduct = async (code, carrito) => {
  try {
    const response = await fetch(`/api/cart/${carrito}/product/${code}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteFromCart = async (code) => {
  const lsCartId = localStorage.getItem("cartId");
  const response = await deleteProduct(code, lsCartId);
  if (response.status === 200) {
    alert("Producto eliminado del carrito");
  }
};
const submitOrder = async () => {
  const lsCartId = localStorage.getItem("cartId");
  try {
    const response = await fetch(`/api/cart/${lsCartId}/order`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    if (response.status === 200) {
      alert("Orden generada");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
