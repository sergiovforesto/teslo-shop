'use server'
import prisma from "@/lib/prisma"

import { Address } from "@/interfaces"

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const newAddress = await createOrReplaceAddress(address, userId)

        return {
            ok: true,
            address: newAddress
        }

    } catch (error) {
        console.log(error)

        return {
            ok: false,
            message: 'Error al guardar la dirección'
        }
    }
}


const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        })

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            city: address.city,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
        }

        if (!storedAddress) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            })

            return newAddress
        }


        //si exite es porque hay que actualizarla
        const updateAddress = await prisma.userAddress.update({
            where: {userId},
            data: addressToSave
        })

        return updateAddress

    } catch (error) {
        console.log(error)
        throw new Error('No se pudo guardar la dirección')
    }
}