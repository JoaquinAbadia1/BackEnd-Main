const socket = io();

socket.emit("connection", "nuevo cliente conectado");

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const productTitle = document.getElementById("productTitle").value;
  const productDescription =
    document.getElementById("productDescription").value;
  const productPrice = document.getElementById("productPrice").value;
  const productThumbnail = document.getElementById("productThumbnail").value;

  console.log(
    "Nuevo producto agregado:",
    productTitle,
    productDescription,
    productPrice,
    productThumbnail
  );
  // Enviar el producto al servidor a través del socket
  socket.emit("agregarProducto", {
    title: productTitle,
    description: productDescription,
    price: productPrice,
    thumbnail: productThumbnail,
  });
});
