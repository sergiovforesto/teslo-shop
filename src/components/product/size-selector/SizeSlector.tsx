import { Size } from "@/interfaces"
import clsx from "clsx";

interface Props {
    seletedSize?: Size;
    availableSizes: Size[]

    onSizeSelected: ( size: Size) => void
}

export const SizeSelector = ({seletedSize, availableSizes, onSizeSelected} : Props) => {
  return (
    <div className="my-5 ">
        <h3 className="font-bold mb-4">Tallas disponibles</h3>

        <div className="flex">
            {
                availableSizes.map(( size ) => (
                    <button
                        key={size}
                        onClick={() => onSizeSelected(size)}
                        type="button"
                        className={
                            clsx(
                                "mx-1 hover:bg-blue-500 rounded-full px-3 py-1 hover:text-white",
                                {
                                    'bg-blue-500 rounded-full text-white': size === seletedSize
                                }
                            )
                        }
                    >
                        {size}
                    </button>
                ))
            }
        </div>
    </div>
  )
}
