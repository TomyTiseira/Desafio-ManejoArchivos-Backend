const fs = require('fs');

class Contenedor {
    constructor(file) {
        this.file = file;
        this.products = [];
    }

    async save(product) {
        await this.getAll();

        const id = this.products.length + 1;
        const productAdd = {...product, id}

        fs.promises.writeFile(this.file, JSON.stringify([...this.products, productAdd], null, 2));
    }

    async getById(number) {
        await this.getAll();

        return this.products.find((product) => product.id === number);
    }

    getAll() {
        return fs.promises.readFile(this.file, 'utf-8')
            .then(value => JSON.parse(value))
            .then(products => this.products = products)
            .catch(e => console.log(e));
    }

    async deleteById(number) {
        await this.getAll();

        const productsFiltered = this.products.filter(product => product.id !== number); 
        this.updateId(productsFiltered);

        fs.promises.writeFile(this.file, JSON.stringify(productsFiltered, null, 2));
    }

    updateId(products) {
        for (let i = 0; i < products.length; i++) {
            products[i].id = i + 1;
        }
    }

    deleteAll() {
        fs.promises.writeFile(this.file, '[]')
            .catch(e => console.log(e));
    }
}

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
        .then(() => console.log(contenedor.products));
    
    await contenedor.deleteAll();
    
    await contenedor.deleteById(4);
}

main();