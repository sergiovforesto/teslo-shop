'use client'

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"



export const PlaceOrder = () => {

    const router = useRouter()

    const [loding, setLoding] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isPlacingOrden, setIsPlacingOrden] = useState(false)

    const address = useAddressStore(state => state.address)
    const { subTotal, tax, total, itemsInCart } = useCartStore(state => state.getSummaryInformation())
    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)


    useEffect(() => {
        setLoding(true)
    }, [])

    const onPlaceOrder = async() => {
        setIsPlacingOrden(true)

        const productsToOrder = cart.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))

        //actions
        const resp = await placeOrder(productsToOrder, address)
        
        if(!resp.ok) {

            setIsPlacingOrden(false)
            setErrorMessage(resp.message)
            return
        }


        //redireccionar
        clearCart()

        router.replace('/orders/' + resp.order?.id)


    }

    if (!loding) {
        return <p>Loading...</p>
    }


    return (
        <div
            className="bg-white rounded-xl shadow-xl p-7 h-fit"
        >

            <h2 className="text-2xl mb-2 underline">Dirreción de Entrega</h2>

            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>
                    {address.city} {address.country}
                </p>
                <p>{address.phone}</p>
            </div>

            <div className="w-full h-[1px] rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 underline">Resumen de Orden</h2>

            <div className="grid grid-cols-2">

                <span>N° Productos</span>
                <span className="text-right">
                    {
                        itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`
                    }
                </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos(15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>

            
            <p className="text-rose-500">{ errorMessage }</p>

            <div className="mt-5 mb-2 w-full">  

                <button
                onClick={onPlaceOrder}
                    // href={`/orders/123`}
                    className={
                        clsx(
                            {
                                'btn-primary': !isPlacingOrden,
                                'btn-disabled': isPlacingOrden
                            }
                        )
                    }
                >
                    Comprar
                </button>

            </div>

        </div>
    )
}
