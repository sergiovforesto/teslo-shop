'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useEffect, useState } from "react"

export const OrderSummary = () => {

    const [loading, setLoading] = useState(false)
    const {subTotal, tax, total} = useCartStore(state => state.getSummaryInformation())
    const totalItems = useCartStore(state => state.getTotalItems())

    useEffect(() => {
        setLoading(true)
    }, [])

    if(!loading) return <p className="text-blue-600 animate-pulse">Loading...</p>

    return (
        <>
            <div className="grid grid-cols-2">

                <span>N° Productos</span>
                <span className="text-right">
                    {
                        totalItems === 1 ? '1 artículo' : `${totalItems} artículos`
                    }
                </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal) }</span>

                <span>Impuestos(15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>


            </div>
        </>
    )
}
