import { Router } from "express";

let viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
  res.render("saludo", { title: "Home", name: joaquin });
});
viewsRouter.get("/saludo", (req, res) => {
  const { name } = req.query;
  res.render("saludo", { title: "Saludo", name: name });
});

export default viewsRouter;
