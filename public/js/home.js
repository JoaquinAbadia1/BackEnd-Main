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
  if (response.status === 200) {
    alert("Producto agregado al carrito");
  }
}
