const fs = require('fs');

// Class Contenedor.
class Contenedor {
    constructor(file) {
        this.file = file;
        this.products = [];
    }

    // Add product.
    async save(product) {
        await this.getProducts();

        // Cualquiera de las 2 formas funcionan para que el primer producto sea con id 1.
        // const id = this.products ? this.products.length + 1 : 1;
        const id = this.products.length + 1;
        const productAdd = {...product, id}

        fs.promises.writeFile(this.file, JSON.stringify([...this.products, productAdd], null, 2));
    }

    // Get product by id.
    async getById(number) {
        await this.getProducts();

        return this.products.find((product) => product.id === number);
    }

    // Get all products.
    async getAll() {
        await this.getProducts();
        return this.products;
    }

    // Save products in attribute products.
    getProducts() {
        return fs.promises.readFile(this.file, 'utf-8')
            .then(value => JSON.parse(value))
            .then(products => this.products = products)
            .catch(e => console.log(e));
    }

    // Delete product by id.
    async deleteById(number) {
        await this.getProducts();

        const productsFiltered = this.products.filter(product => product.id !== number); 
        this.updateId(productsFiltered);

        fs.promises.writeFile(this.file, JSON.stringify(productsFiltered, null, 2));
    }

    // Update products id.
    updateId(products) {
        for (let i = 0; i < products.length; i++) {
            products[i].id = i + 1;
        }
    }

    // Delete all products.
    deleteAll() {
        fs.promises.writeFile(this.file, '[]')
            .catch(e => console.log(e));
    }
}

// Function main.
const main = async () => {
    const contenedor = new Contenedor('./productos.json');

    const product = {
        title: "Café",
        price: 350.25,
        thumbnail: "https://i1.wp.com/www.buenosbares.com/wp-content/uploads/2018/04/cafe.jpg?fit=688%2C459",
    }
    
    await contenedor.save(product);
    
    await contenedor.getById(4)
        .then((value) => console.log(value));
    
    await contenedor.getAll()
        .then(value => console.log(value));
 
    await contenedor.deleteAll();
    
    await contenedor.deleteById(4);
}

// Execute function main.
main();

