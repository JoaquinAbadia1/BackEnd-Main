async function addToCart(code) {
  let carrito = "1";
  postToCart(code, carrito)
    .then((dato) => {
      alert("product added successfully", dato);
    })
    .catch((err) => {
      console.error(err);
    });
  console.log(code);
}

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
