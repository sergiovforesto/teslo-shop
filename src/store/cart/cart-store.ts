import { create } from 'zustand'
import { persist } from 'zustand/middleware';

import type { CartProduct } from "@/interfaces";


interface State {
    cart: CartProduct[]
    getTotalItems: () => number;
    getSummaryInformation: () => {
        itemsInCart: number;
        subTotal: number;
        tax: number;
        total: number;
    };

    addProductToCart: (product: CartProduct) => void
    updateProductQuantity: (product: CartProduct, quantity: number) => void
    removeProduct: (product: CartProduct) => void


    clearCart: () => void;
}

export const useCartStore = create<State>()(

    //con este middleware ya configuras tu localStorage persistente sin mas configuracion
    persist(

        (set, get) => ({

            cart: [],

            //Methods

            getTotalItems: () => {
                const {cart} = get()

                return cart.reduce((total, item) => total + item.quantity, 0)
            },

            getSummaryInformation: () => {
                const {cart} = get()

                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal , 0)
                
                const tax = subTotal * 0.15
                const total = subTotal + tax
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0)

                return {
                    itemsInCart, subTotal, tax, total
                }
            },

            addProductToCart: (product: CartProduct) => {
                const { cart } = get()

                //si existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                )

                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return
                }

                //se que el producto existe por talla... tengo que incrementar
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }

                    return item
                })


                set({ cart: updatedCartProducts })
            },


            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get()


                const updatedCartProducts = cart.map((item) => {
                    if(item.id === product.id && item.size === product.size) {
                        return {...item, quantity: quantity}
                    }

                    return item
                })

                set({ cart: updatedCartProducts })
            },

            removeProduct: (product: CartProduct) => {
                const { cart } = get()


                const updatedCartProducts = cart.filter(
                    (item) => item.id !== product.id || item.size !== product.size
                )

                set({ cart: updatedCartProducts })

            },

            clearCart: () => {
                set({ cart: [] })
            }
        })

        ,
        //nombre de tu localStorage
        {
            name: 'shopping-cart'
        }
    )
)