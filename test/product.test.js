import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest.agent("http://localhost:8080");

describe("testing del eccomerce", () => {
  describe("testing de los productos", () => {
    it("deberia crear un producto", async () => {
      const productMock = {
        title: "producto1",
        description: "descripcion1",
        code: 1,
        price: 100,
        stock: 10,
        categoty: "categoria1",
        thumbnail: "url",
      };
      const { statusCode, ok, _body } = await requester
        .post("/api/products/addnewProduct")
        .send(productMock);
      console.log({ statusCode }, { ok }, { _body });
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
    it("deberia obtener un producto", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products");
      console.log({ statusCode }, { ok }, { _body });
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
    it("deberia obtener un producto por id", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products/8");
      console.log({ statusCode }, { ok }, { _body });
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
    it("deberia actualizar un producto", async () => {
      const productMock = {
        title: "producto1",
        description: "descripcion1",
        code: 1,
        price: 100,
        stock: 10,
        categoty: "categoria1",
        thumbnail: "url",
      };
      const { statusCode, ok, _body } = await requester
        .put("/api/products/8")
        .send(productMock);
      console.log({ statusCode }, { ok }, { _body });
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
    it("deberia eliminar un producto", async () => {
      const { statusCode, ok, _body } = await requester.delete(
        "/api/products/8"
      );
      console.log({ statusCode }, { ok }, { _body });
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
    });
  });
});
