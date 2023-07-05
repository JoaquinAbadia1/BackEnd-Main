import fs from 'fs';
import http from 'http';
import express from 'express'
import productManager from './productManager.js';
const app = express()
// Apertura del servidor
app.get('/', (req, res) => {
    res.send('Welcome to the world with your new web app')
})
// escucha del servidor
app.listen(8080, () => console.log('Server listening on port 8080'));

const product = new productManager("./products.json")

app.get('/products', (req, res) => {
    const products =  product.getProducts()
    res.json(products)
})

app.get('/products/:id', (req, res) => {
    res.json(product.getProductsById(req.params.id))
})
app.get('/products/addProduct', (req, res) => {
    let {title,description,price,thumbnail,code,stock} = req.query
    product.addProduct(title,description,price,thumbnail,code,stock)
    res.send('producto agregado')

    
})
