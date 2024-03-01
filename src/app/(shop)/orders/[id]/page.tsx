import { getOrderById } from "@/actions";
import { OrderStatus, PaypalBtn, Title } from "@/components";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";


interface Props {
  params: {
    id: string;
  }
}

export default async function OrderIdPage({ params }: Props) {

  const { id } = params


  const { ok, order, } = await getOrderById(id)

  if (!ok) {
    redirect('/')
  }

  const address = order?.OrderAddress;


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(0)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/**Carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={order!.isPaid}/>


            {/** Items*/}
            {
              order!.OrderItem.map((item) => (
                <div key={item.product.slug} className="flex mb-5">
                  <Image
                    src={`/products/${item.product.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    alt={item.product.title}
                    className="rounded mr-5 object-cover"
                  />

                  <div>
                    <p>{item.product.title}</p>
                    <p>${item.price} x {item.quantity}</p>
                    <p className="font-bold">SubTotal: {currencyFormat(item.price * item.quantity)}</p>


                  </div>
                </div>
              ))
            }

          </div>


          {/**Checkout */}
          <div
            className="bg-white rounded-xl shadow-xl p-7 h-fit"
          >

            <h2 className="text-2xl mb-2">Dirreción de Entrega</h2>

            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city} {address?.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            <div className="w-full h-[1px] rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de Orden</h2>

            <div className="grid grid-cols-2">

              <span>N° Productos</span>
              <span className="text-right">
                {
                  order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`
                }
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>

              <span>Impuestos(15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>


            </div>


            <div className="mt-5 mb-2 w-full">

              {
                order?.isPaid ? (
                  <OrderStatus isPaid={order!.isPaid}/>
                ) : (
                  <PaypalBtn orderId={order!.id} amount={order!.total} />
                )
              }


            </div>

          </div>



        </div>

      </div>
    </div>
  )
}
