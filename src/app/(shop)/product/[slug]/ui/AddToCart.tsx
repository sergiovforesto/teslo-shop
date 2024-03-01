'use client'
import { QuantitySelector, SizeSelector } from "@/components"
import { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
    product: Product;
}

export const AddToCart = ({product} : Props) => {

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    const addProductToCard = useCartStore( state => state.addProductToCart)

    const addToCart = () => {
        setPosted(true)
        if(!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCard(cartProduct)

        setPosted(false)
        setQuantity(1)
        setSize(undefined)
    }

  return (
    <>
        {/**Selector de tallas */}
        <SizeSelector 
          seletedSize={size}
          availableSizes={product.sizes}
          onSizeSelected={size => setSize(size)}
        />

        {/**Selector de cantidad*/}
        <QuantitySelector 
          quantity={quantity}
          onQuantityChanged={quantity => setQuantity(quantity)}
        />

        {
            posted && !size && (

                <p className="mt-2 text-xs text-rose-600 faded-in">
                * Debe seleccionar una talla *
                </p>
            )
        }
        

        {/**button*/}
        <button
          type="button"
          onClick={addToCart}
          className="btn-primary my-5"
          >
          agregar al carrito
        </button>
    </>
  )
}
