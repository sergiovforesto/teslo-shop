'use client'
import { useCartStore } from "@/store"
import Image from "next/image"
import Link from "next/link"
import { ProductImage, QuantitySelector } from "@/components"
import { useEffect, useState } from "react"

export const ProductsInCart = () => {
  const updateProductsQuantity = useCartStore(state => state.updateProductQuantity)
  const removeProduct = useCartStore(state => state.removeProduct)
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
            <ProductImage
              src={product.image}
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
              <Link
                className="hover:underline cursor-pointer"
                href={`/product/${product.slug}`}
              >
                {product.size} - {product.title}
              </Link>
              <p>${product.price}</p>
              <QuantitySelector quantity={product.quantity} onQuantityChanged={quantity => updateProductsQuantity(product, quantity)} />

              <button
                onClick={() => removeProduct(product)}
                type="button"
                className="underline mt-3"
              >
                Remover
              </button>

            </div>
          </div>
        ))
      }
    </>
  )
}
