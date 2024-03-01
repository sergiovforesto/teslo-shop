'use server'
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '')
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteProductImage = async(imageId: number, imageUrl: string) => {
    if(!imageUrl.startsWith('http')) {
        return {
            ok: false,
            message: 'No se pueden borrar imagenes de File System'
        }
    }

    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? ''

    try {
        await cloudinary.uploader.destroy(imageName)

        const deleteImage = await prisma.productImage.delete({
            where: {id: imageId},
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        })

        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${deleteImage.product.slug}`)
        revalidatePath(`/product/${deleteImage.product.slug}`)


    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
    }
} 