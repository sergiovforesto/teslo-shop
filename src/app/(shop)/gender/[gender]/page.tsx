export const revalidate = 0

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductsGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { notFound, redirect } from "next/navigation";


interface Props {
  params: {
    gender: string;
  },
  searchParams: {
    page?: string
  }
}

export default async function GenderPageId({ params, searchParams }: Props) {

  const { gender } = params

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  
  const {products, currrentPage, totalPages} = await getPaginatedProductsWithImages({page, gender: gender as Gender})
  if(products.length === 0 ) {
    redirect(`/gender/${gender}`)
  }


  const labels: Record<string, string> = {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Para todos'
  }

  // if (id === 'kids') {
  //   notFound()
  // }


  return (
    <>
      <Title
        title={`Articulos de ${labels[gender]}`}
        subTitle="Todos los productos"
        className="mb-2"
      />

      <ProductsGrid 
        products={products}
      />

      <Pagination totalPages={totalPages}/>
    </>
  )
}
