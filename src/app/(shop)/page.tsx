export const revalidate = 0

import { Pagination, Title } from "@/components";
import { initialData } from "@/seed/seed"; // datos de prueba
import { ProductsGrid } from '../../components/products/products-grid/ProductsGrid';
import { getPaginatedProductsWithImages } from "@/actions";
import { redirect } from "next/navigation";

//const productsTemp = initialData.products// temporal, para hacer la maquitacion

interface Props {
  searchParams: {
    page?: string
  }
}

export default async function Home({searchParams}: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const {products, currrentPage, totalPages} = await getPaginatedProductsWithImages({page})

  if(products.length === 0 ) {
    redirect('/')
  }


  return (
    <>
      <Title
        title="Tienda"
        subTitle="Todos los productos"
        className="mb-2"
      />

      <ProductsGrid 
        products={products}
      />

      <Pagination totalPages={totalPages}/>
    </>
  );
}
