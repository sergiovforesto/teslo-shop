'use server'
import { Gender, Product, Size } from '@prisma/client'
import {z} from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
})


export const createUpdateProduct = async(formData: FormData) => {
    const data = Object.fromEntries(formData)
    const productParsed = productSchema.safeParse(data)

    if(!productParsed.success) {

        console.log(productParsed.error)
        return {ok: false}
    }

    
    const newProduct = productParsed.data;
    newProduct.slug = newProduct.slug.toLowerCase().replace(/ /g, '-').trim()
    const {id, ...rest} = newProduct

    try {
        
        const prismaTx = await prisma.$transaction(async (tx) => {
    
            let product: Product
    
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase())
            if(id) {
                //actualizar
                product = await prisma.product.update({
                    where: {id: id},
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
    
                        tags: {
                            set: tagsArray
                        }
                    }
                })
    
    
            }else {
                //crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }
    
            //proceso de carga y guardado de imagenes
            if(formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[])

                if(!images) {
                    throw new Error('No se pudo cargar las imagenes')
                }

                await prisma.productImage.createMany({
                    data: images.map((image) => ({
                        url: image!,
                        productId: product.id
                    }))
                })
            }
    
            return {
                product
            }
        })


        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${newProduct.slug}`)
        revalidatePath(`/products/${newProduct.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }

    } catch (error) {
        return {
            ok:false,
            message: 'No se los log, no se pudo actualizar/crear'
        }
    }


    
}

const uploadImages = async(images: File[]) => {

    try {

        const uploadPromises = images.map(async(image) => {
            try {
                const buffer = await image.arrayBuffer()//convierte a arreglo de memoria temporal
                const base64Image = Buffer.from(buffer).toString('base64')//lo convertimos en algo que se pueda leer/y cloudinary lo entienda
    
                //referencia de = data:image/png;base64,${base64Image} === data:[<mediatype>][;base64],<data>
                //https://www.rfc-editor.org/rfc/rfc2397
                //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs 
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {folder: 'teslashop'})
                .then(r => r.secure_url)
                
            } catch (error) {
                return null
            }
        })

        const uploadedImages = await Promise.all(uploadPromises)
        return uploadedImages


    } catch (error) {
        console.log(error)
        return null
    }
}