'use server'
import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma"

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth()
    const userId = session?.user.id

    //verificar sesion de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }


    //note: podemos llevar dos o mas productos con el mismo id
    //vamos a buscar todos los productos cuyo id exista en el arreglo de productsIds
    const products = await prisma.product.findMany({
        where: {
            id: {
                //https://www.prisma.io/docs/orm/reference/prisma-client-reference#in  in: en un filtro que busca en una lista
                in: productIds.map((p) => p.productId)
            }
        }
    })

    // calcular los montos
    const itemsInOrder = productIds.reduce((count, product) => count + product.quantity, 0)

    //subtotal, tax y  total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals
    }, { subTotal: 0, tax: 0, total: 0 })

    //transaccion 
    try {
        //https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
        const prismaTx = await prisma.$transaction(async (tx) => {

            //1. actualizar stock de los productos
            const updateProductsPromises = products.map((product) => {

                const productQuantity = productIds.filter((p) => p.productId === product.id).reduce((acc, item) => item.quantity + acc, 0)


                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`)
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity //NO HACER ESTO, PORQUE CON VARIAS PERSONAS COMPRANDO PUEDE CAUSAR UN ERROR
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updateProductsPromises)

            //verificar valores negativos = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })



            //2. Crear la orden - Encabezado - detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    //table- OrdenItem
                    OrderItem: {
                        //createMany porque en esa order son varios productos
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            //si el price es cero, error


            //3. crear la direccion de la orden
            const { country, ...restAddress } = address

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                updatedProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress
            }

        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }





}