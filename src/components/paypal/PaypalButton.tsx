'use client'
//https://www.npmjs.com/package/@paypal/react-paypal-js

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}
//onApprove={} se dispara cuando se realiza el proceso existosamente
export const PaypalBtn = ({orderId, amount} :Props) => {
    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = (Math.round(amount * 100)) / 100; //123.23

    if(isPending) {
        return (
            <div className="animate-pulse mb-20">
                <div className="h-11 bg-gray-300 rounded"></div>
                <div className="h-11 mt-2 bg-gray-300 rounded"></div>
            </div>
        )
    }

    const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            purchase_units: [
                {   
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`
                    }
                }
            ]
        })


        const {ok} = await setTransactionId(orderId, transactionId)

        if(!ok) {
            throw new Error('No se pudo actualizar la orden')
        }

        return transactionId
    }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture()
        if(!details) return

        await paypalCheckPayment(details.id)
    }

  return (
    <div className="relative z-0">
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
        />
    </div>
  )
}
