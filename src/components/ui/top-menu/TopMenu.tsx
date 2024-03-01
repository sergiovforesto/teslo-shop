'use client'

import { titleFont } from "@/config/fonts"
import { useCartStore, useUiStore } from "@/store"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IoSearchCircleOutline, IoCartOutline } from "react-icons/io5"

export const TopMenu = () => {
  const openSideMenu = useUiStore(state => state.openSideMenu)
  const totalItemsInCart = useCartStore(state => state.getTotalItems())

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <nav className="flex px-5 justify-between items-center w-full">


      <div className="">
        <Link
          href={'/'}
        >
          <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
          <span> | Shop</span>
        </Link>
      </div>
      

      <div className="hidden sm:block">
        <Link
          href={'/gender/men'}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Hombres
        </Link>

        <Link
          href={'/gender/women'}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Mujeres
        </Link>

        <Link
          href={'/gender/kid'}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Niños
        </Link>
      </div>

      <div className="flex items-center">
        <Link href={'/search'} className="mx-2">
          <IoSearchCircleOutline className="w-5 h-5"/>
        </Link>

        <Link href={
          ((totalItemsInCart === 0) && loading)
          ? '/empty'
          : '/cart'
        } className="mx-2">
          <div className="relative">

            {
              (loading && totalItemsInCart > 0) && (
                <span className="fade-in absolute text-xs font-bold rounded-full px-1 -top-2 -right-2 bg-blue-700 text-white">
                  {totalItemsInCart}
                </span>

              )
            }

            <IoCartOutline className="w-5 h-5"/>
          </div>
        </Link>

        <button 
          type="button"
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menu
        </button>
      </div>

    </nav>
  )
}
