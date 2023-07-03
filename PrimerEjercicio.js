import fs from 'fs';
class productManager{
    products;
    #path = ""
    constructor(path) {
        this.#path = path
        
    }
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.#path, "utf-8")
            console.log(JSON.parse(products))
            return JSON.parse(products);
        } catch {
            return []
        }
    };

    async addProduct (title,description,price,thumbnail,code,stock) {
        
        let products = await this.getProducts()
        let codeRepeat = products.some(dato => dato.code === code)
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Faltan campos por completar");
        }else if(codeRepeat){
            throw new Error("codigo repetido");
        }
        else {
            const newProduct = { title,description,price,thumbnail,code,stock,id: products.length +1 }
            products = [...products, newProduct];
            // this.products.push()
            await fs.promises.writeFile(this.#path, JSON.stringify(products))
        }
        
    }
    
    async getProductsById(id) {
        let products = await this.getProducts();
        let findID = products.find(e => e.id === id);
        if (findID) {
            console.log(findID)
            return findID
        } else {
            throw new Error("El ID indicado no existe")
        }
    };

    async deleteProduct(id) {
        let product = await this.getProducts();
        let searchIdDelete = product.map(i => i.id !== id)
        await fs.promises.writeFile(this.#path, JSON.stringify(searchIdDelete))
        console.log('Producto eliminado con éxito')
    }
    async updateProdcutByID(id,modified){
        let product =  await this.getProducts()
        console.log(product)
        let idSearch = product.find(i => i.id === id)
        if (!idSearch){
            throw new Error("No se a econtrado el id especificado");
        }else{
            idSearch = { ...idSearch, modified };
            let newArray = product.filter(prods => prods.id !== id)
            newArray = [...newArray, idSearch];
            await fs.promises.writeFile(this.#path, JSON.stringify(newArray));
            console.log('Modificación realizada con éxito.')
        }
    }
}


const main = async () => {
    const manager = new productManager("./products.json");
    // await manager.addProduct("juego", "asdf", 999 , "asdasdasdasdasdasdas", 123,33333);
    // await manager.deleteProduct(3)
    //await manager.getProducts()
    // await manager.getProductsById(4)
    await manager.updateProdcutByID(1, "asdasdasdasdas")

}
main()