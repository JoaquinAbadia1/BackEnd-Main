class productManager{
    products;
    
    constructor() {
        this.products = [];
    }
    addProduct (tittle,description,price,thumbnail,code,stock,id) {
        
        let codeRepeat = this.products.some(dato => dato.code === code)
        this.products.push(newProduct);
        if(!this.tittle || !this.description || !this.price || !this.thumbnail || !this.code || !this.stock) {
            console.error("Faltan campos por completar");
        }else if(codeRepeat){
            console.error("codigo repetido");
        }
        else {
            const newProduct = { tittle,description,price,thumbnail,code,stock,id: this.products.length +1 }
            this.products.push()
            
        }
    }
    getProducts =() => {
        return this.products
    }
    getProductsById =() => {
        let product = this.products.find(p => p.id === id)
        if(product !== undefined){
            return product;
        }else{
            return "no existe el id solicitado";
        }
    }
}