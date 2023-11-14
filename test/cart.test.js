import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest.agent("http://localhost:8080");
const lsCartId = localStorage.getItem("cartId");

describe("Cart", () => {
  it("deberia obtener un carrito", async () => {
    const { statusCode, ok, _body } = await requester.get(
      `/api/cart/${lsCartId}`
    );
    console.log({ statusCode }, { ok }, { _body });
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });
  it("deberia agregar un producto al carrito", async () => {
    const { statusCode, ok, _body } = await requester.post(
      `/api/cart/${lsCartId}/product/8`
    );
    console.log({ statusCode }, { ok }, { _body });
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });
  it("deberia eliminar un producto del carrito", async () => {
    const { statusCode, ok, _body } = await requester.delete(
      `/api/cart/${lsCartId}/product/8`
    );
    console.log({ statusCode }, { ok }, { _body });
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });
  it("deberia crear un carrito nuevo", async () => {
    const { statusCode, ok, _body } = await requester.post(`/api/cart/newCart`);
    console.log({ statusCode }, { ok }, { _body });
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
  });
});
