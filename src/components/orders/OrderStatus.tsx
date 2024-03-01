import clsx from "clsx"
import { IoCartOutline } from "react-icons/io5"

interface Props {
    isPaid: boolean
}

export const OrderStatus = ({isPaid}: Props) => {
    return (
        <div className={
            clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                    'bg-rose-500': !isPaid,
                    'bg-emerald-500': isPaid
                }

            )
        }>
            <IoCartOutline size={30} />
            <span className="mx-2">
                {
                    isPaid ? 'Pagada' : 'No pagada'
                }
            </span>
        </div>
    )
}