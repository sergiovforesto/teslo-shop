'use client'
import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (value: number) => void    
}

export const QuantitySelector = ({quantity, onQuantityChanged}: Props) => {


    const onValueChange = (value: number) => {
        if(quantity + value < 1) return

        onQuantityChanged(quantity + value)
    }
  return (
    <div className="flex items-center">
        <button type="button" onClick={() => onValueChange(-1)}>
            <IoRemoveCircleOutline size={30}/>
        </button>

        <span className="w-20 mx-3 px-5 bg-gray-200 text-center text-blue-700 font-semibold rounded">
            { quantity }
        </span>

        <button type="button" onClick={() => onValueChange(+1)}>
            <IoAddCircleOutline size={30}/>
        </button>
    </div>
  )
}
