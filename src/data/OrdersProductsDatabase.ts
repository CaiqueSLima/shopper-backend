import { OrderOutputDTO } from "../business/OrderBusiness"
import { DbAccessError } from "../errors/DbAccessError"
import { BaseDatabase } from "./BaseDatabase"

export interface OrdersProductsToDB {
    order_id: string
    product_id: number
    quantity: number
}

export class OrdersProductsDatabase extends BaseDatabase {

    private static TABLE_NAME = 'shopper_orders_products'

    public async createProductList(order: OrderOutputDTO): Promise<void> {

        try {

            const products = order.products

            const productsToDB = products.map(product => {

                const productToDB: OrdersProductsToDB = {
                    order_id: order.id,
                    product_id: product.id,
                    quantity: product.quantity
                }

                return productToDB
            })

            await BaseDatabase.connection(OrdersProductsDatabase.TABLE_NAME).insert(productsToDB)

        } catch (error: any) {

            throw new DbAccessError(error.message)
        }
    }
}