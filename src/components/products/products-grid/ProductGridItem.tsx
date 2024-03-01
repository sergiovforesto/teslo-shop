'use client'
import { ProductImage } from "@/components"
import { Product } from "@/interfaces"
import Link from "next/link"
import { useState } from "react"

interface Props {
  product: Product
}

export const ProductGridItem = ({ product }: Props) => {

  const [displayImage, setDisplayImage] = useState(product.images[0])

  return (
    <div className="rounde-md overflow-hidden fade-in">
      <Link
        href={`/product/${product.slug}`}
      > 
        <ProductImage
          src={displayImage}
          alt={product.title}
          className="w-full object-cover rounded"
          width={500}
          height={500}
          onMouseEnter={() => setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-blue-500" 
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>

    </div>
  )
}
