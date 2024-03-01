"use client";

import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { useForm } from "react-hook-form";
import Image from "next/image";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";

interface Props {
  product: Partial<Product> & {ProductImage?: ProductWithImage[]};
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string

  images?: FileList
}

export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: {isValid},
    getValues,
    setValue,
    watch

  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],

      images: undefined
    }
  })


  //rederizar si las tallas cambian
  watch('sizes')

  const onSizeChanged = (size:string) => {
    const sizes = new Set( getValues('sizes') ) 
    sizes.has( size ) ? sizes.delete(size) : sizes.add(size)
    

    setValue('sizes', Array.from(sizes))

  }

  const onSubmit = async(data: FormInputs) => {
    const formData = new FormData()

    const {images, ...produtToSave} = data

    if(product.id) {
      formData.append('id', product.id ?? '')

    }

    formData.append('title', produtToSave.title)
    formData.append('slug', produtToSave.slug)
    formData.append('description', produtToSave.description)
    formData.append('price', produtToSave.price.toString())
    formData.append('inStock', produtToSave.inStock.toString())
    formData.append('sizes', produtToSave.sizes.toString())
    formData.append('tags', produtToSave.tags)
    formData.append('categoryId', produtToSave.categoryId)
    formData.append('gender', produtToSave.gender)

    if(images) {
      for(let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    const {ok, product:updatedProduct} = await createUpdateProduct(formData)
    
    if(!ok) {
      alert('Product no se pudo actualizar')
      return
    }

    router.replace(`/admin/product/${updatedProduct?.slug}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title', {required: true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('slug', {required: true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', {required: true})}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('price', {required: true, min: 0})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('tags', {required: true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', {required: true})}>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', {required: true})}>
            <option value="">[Seleccione]</option>

            {
              categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            }

          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('inStock', {required: true, min: 0})}/>
        </div>


        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div 
                  key={ size } 
                  onClick={() => onSizeChanged(size)}
                  className={
                    clsx(
                      "w-14 p-2 mr-2 cursor-pointer mb-2 border rounded-md transition-all text-center",
                      {
                        'bg-blue-600 text-white': getValues('sizes').includes(size)
                      }

                    )
                  }
                >
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              {...register('images')}
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg, image/avif"
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map((image) => (
                <div key={image.id}>
                  <ProductImage
                    src={image.url}
                    width={300}
                    height={300}
                    alt={product.title ?? ''}
                    className="rounded shadow-md"
                  />

                  <button 
                    onClick={() => deleteProductImage(image.id, image.url)}
                    type="button" className="btn-danger w-full mt-2"
                  >
                    eliminar
                  </button>
                </div>

              ))
            }
          </div>

        </div>
      </div>
    </form>
  );
};