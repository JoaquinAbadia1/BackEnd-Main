// Recupera el carrito desde Local Storage
const carritoJSON = localStorage.getItem("cartId");

// Convierte la cadena JSON de nuevo en un objeto
const carrito = JSON.parse(carritoJSON);
// Compila el template Handlebars
const source = document.getElementById("carrito_template").innerHTML;
const template = Handlebars.compile(source);

// Renderiza el carrito en el contenedor
const html = template(carrito);
document.getElementById("carrito-container").innerHTML = html;
