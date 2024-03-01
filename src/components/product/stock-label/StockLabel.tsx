'use client'

import { getStockBySlug } from "@/actions";
import { useEffect, useState } from "react";

interface Props {
    slug: string;
}

export const StockLabel = ({slug} : Props) => {
    const [stock, setStock] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getStock = async() => {
            const inStock = await getStockBySlug(slug)
            setStock(inStock)
            setLoading(false)
        }

        getStock()
    }, [slug])


  return (
    <>

        {
            loading ? (
                <p className="text-lg mb-5 bg-slate-300 animate-pulse">
                    &nbsp;
                </p>

            ) : (
                
                <p className="text-lg mb-5">
                    Stock: {stock}
                </p>

            )
        }

    </>

  )
}
