import { CsvToJson } from "../services/CsvToJson"
import { BaseDatabase } from "./BaseDatabase"

abstract class Migrations extends BaseDatabase {
    public static async main() {
        try {
            await BaseDatabase.connection.raw(`
            CREATE TABLE IF NOT EXISTS shopper_stock (
                    id INT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price DOUBLE(10,2) NOT NULL,
                    qty_stock INT NOT NULL
                );

            CREATE TABLE IF NOT EXISTS shopper_orders (
                    id VARCHAR(255) PRIMARY KEY,
                    costumer_name VARCHAR(255) NOT NULL,
                    delivery_date DATE NOT NULL
                );
            
            CREATE TABLE IF NOT EXISTS shopper_orders_products (
                    order_id VARCHAR(255) NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES shopper_orders(id),
                    FOREIGN KEY (product_id) REFERENCES shopper_stock(id)
                );
            `)

            console.log('Tabelas criadas')

            const products = await CsvToJson.convertFile("./src/data/products_ascii.csv")
            
            // This validation map is necessary because some products have commas on their names,
            // confusing the conversion from csv file format, which creates extra object keys called field5 and field6
            const finalProducts = products.map((product: any) => {
                if (product.field6) {
                    return {
                        id: product.id,
                        name: `${product.name},${product.price},${product.qty_stock}`,
                        price: product.field5,
                        qty_stock: product.field6
                    }
                } else if (product.field5) {
                    return {
                        id: product.id,
                        name: `${product.name},${product.price}`,
                        price: product.qty_stock,
                        qty_stock: product.field5 
                    }
                } else {
                    return product
                }
            })

            await BaseDatabase.connection('shopper_stock').insert(finalProducts)

            console.log('Produtos inseridos no banco de dados')

        } catch (error) {
            console.log(error)
        } finally {
            BaseDatabase.connection.destroy()
        }
    }
}

Migrations.main()