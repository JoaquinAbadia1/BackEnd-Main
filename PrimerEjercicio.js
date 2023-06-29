class productManager{
    products;
    #path = ""
    constructor(path) {
        this.#path = path
        this.products = [];
    }
    async addProduct (tittle,description,price,thumbnail,code,stock,id) {
        
        let codeRepeat = this.products.some(dato => dato.code === code)
        this.products.push(newProduct);
        if(!this.tittle || !this.description || !this.price || !this.thumbnail || !this.code || !this.stock) {
            throw new Error("Faltan campos por completar");
        }else if(codeRepeat){
            throw new Error("codigo repetido");
        }
        else {
            const newProduct = { tittle,description,price,thumbnail,code,stock,id: this.products.length +1 }
            this.products.push()
            
        }
        await fs.promises.writeFile(this.#path, JSON.stringify(products))
    }
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(products);
        } catch {
            return []
        }
    };
    async getProductsById(id) {
        let products = await this.getProducts();
        let findID = products.map(e => e.id === id);
        if (findID) {
            return findID
        } else {
            throw new Error("El ID indicado no existe")
        }
    };
}