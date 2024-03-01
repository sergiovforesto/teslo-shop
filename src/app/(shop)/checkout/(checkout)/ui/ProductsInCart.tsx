'use client'
import { useCartStore } from "@/store"
import Image from "next/image"

import { useEffect, useState } from "react"
import { currencyFormat } from "@/utils"

export const ProductsInCart = () => {
  
  const productsInCart = useCartStore(state => state.cart)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  if (!loading) {
    return <p className="text-blue-600 animate-pulse">Loading...</p>
  }




  return (
    <>
      {
        productsInCart.map((product) => (
          <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <Image
              src={`/products/${product.image}`}
              width={100}
              height={100}
              style={{
                width: '100px',
                height: '100px'
              }}
              alt={product.title}
              className="rounded mr-5 object-cover"
            />

            <div>
              <span>
                {product.size} - {product.title} ({product.quantity})
              </span>
              <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>


            </div>
          </div>
        ))
      }
    </>
  )
}
