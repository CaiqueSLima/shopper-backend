import { Product } from "./Product"

export class Order {
    constructor(
        private id: string,
        private costumerName: string,
        private deliveryDate: string,
        private totalPrice: number,
        private products: Product[]
    ) { }

    public getId = () => this.id
    public getCostumerName = () => this.costumerName
    public getDeliveryDate = () => this.deliveryDate
    public getTotalPrice = () => this.totalPrice
    public getProducts = () => this.products
}