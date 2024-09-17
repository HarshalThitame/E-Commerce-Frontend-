import {Cart} from "./cart.model";
import {Product} from "./products.model";

export interface CartItem {
    cart:Cart,
    product:Product,
    quantity:number,
}
