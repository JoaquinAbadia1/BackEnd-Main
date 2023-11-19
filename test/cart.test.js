import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

const requester = supertest.agent("http://localhost:8080");
let token, cartId;

before(async () => {
  try {
    // Autenticación y obtención del token
    const response = await requester.post("/api/sessions/login").send({ username: "superadmin", password: "123" });
    token = response.body.token;

    // Creación de un nuevo carrito y obtención de su ID
    const cartResponse = await requester.post("/api/cart/newCart").set("Authorization", `Bearer ${token}`);

    // Verifica que la creación del carrito fue exitosa antes de asignar el ID
    expect(cartResponse.statusCode).to.equal(200);
    expect(cartResponse.body).to.have.property("message", "carrito creado");

    // Recupera el ID del carrito si está presente en la respuesta
    if (cartResponse.body._id) {
      cartId = cartResponse.body._id;
    } else if (cartResponse.body.message === "carrito creado") {
      console.error("El ID del carrito no está presente en la respuesta.");
      throw new Error("No se pudo obtener el ID del carrito.");
    } else {
      console.error("La respuesta del servidor no tiene un formato esperado.");
      throw new Error("Formato de respuesta inesperado.");
    }

    // Recupera el ID del carrito si está presente en la respuesta
    if (cartResponse.body._id) {
      cartId = cartResponse.body._id;
    } else {
      console.error("El ID del carrito no está presente en la respuesta.");
      throw new Error("No se pudo obtener el ID del carrito.");
    }
  } catch (error) {
    // Manejo de errores durante la inicialización
    console.error("Error durante la inicialización:", error);
    throw error; // Puedes ajustar esto según tu lógica de manejo de errores
  }
});

describe("Cart", () => {
  it("deberia obtener un carrito", async () => {
    const { statusCode, ok, _body } = await requester.get(`/api/cart/${cartId}`).set("Authorization", `Bearer ${token}`);

    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });

  it("deberia agregar un producto al carrito", async () => {
    const { statusCode, ok, _body } = await requester.post(`/api/cart/${cartId}/product/8`).set("Authorization", `Bearer ${token}`);

    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });

  it("deberia eliminar un producto del carrito", async () => {
    const { statusCode, ok, _body } = await requester.delete(`/api/cart/${cartId}/product/8`).set("Authorization", `Bearer ${token}`);

    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });
});
