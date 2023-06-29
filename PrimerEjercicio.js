const fs = require("fs");
class productManager{
    products;
    #path = ""
    constructor(path) {
        this.#path = path
        this.products = [];
    }
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.#path, "utf-8")
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
        let findID = products.map(e => e.id === id);
        if (findID) {
            return findID
        } else {
            throw new Error("El ID indicado no existe")
        }
    };

    async deleteProduct(id) {
        let product = await this.getProducts();
        let searchIdDelete = product.filter(i => i.id !== id)
        await fs.promises.writeFile(this.#path, JSON.stringify(searchIdDelete))
        console.log('Producto eliminado con éxito')
    }
    async updateProdcutByID(id,modified){
        let product = await this.getProducts()
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
    await manager.updateProdcutByID(1 , "juegazo")
}
    main()