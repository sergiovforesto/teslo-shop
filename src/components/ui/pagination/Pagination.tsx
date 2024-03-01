'use client'
import { generatePaginationNumber } from "@/utils";
import clsx from "clsx";
import Link from "next/link"
import { redirect, usePathname, useSearchParams } from "next/navigation";


interface Props {
    totalPages: number;
}

export const Pagination = ({totalPages}: Props) => {

    const pathName = usePathname()
    const searchParams = useSearchParams()

    const pageString = searchParams.get('page') ?? 1;
    let currentPage = isNaN( +pageString ) ? 1 : +pageString

    if(currentPage < 1) {
        redirect(pathName)
    }

    const allPages = generatePaginationNumber(currentPage, totalPages)
    


    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        
        if(pageNumber === '...') {
            return `${pathName}?${params.toString()}`
        }

        if( +pageNumber <= 0) {
            return `${pathName}`
        }

        if( +pageNumber > totalPages) {

            return `${pathName}?${params.toString()}`
        }

        params.set('page', pageNumber.toString())


        return `${pathName}?${params.toString()}`
    }


   

    return (
        <div className="flex text-center justify-center mt-10 mb-32">
            <nav>
                <ul className="flex">
                    <li>
                        <Link
                            className="relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href="#"
                        >
                            Previous
                        </Link>
                    </li>

                    {
                        allPages.map((page, i) => (

                            <li key={page}>
                                <Link
                                    className={
                                        clsx(
                                            "relative block py-1.5 px-3 mx-1 rounded border-0 outline-none transition-all duration-300 hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md",
                                            {
                                                'text-white bg-blue-600 ': page === currentPage
                                            }
                                        )
                                    }
                                    href={createPageUrl(page)}
                                >
                                    {page}
                                </Link>
                            </li>
                        ))
                    }

                    
                    <li>
                        <Link
                            className="relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href={ createPageUrl(currentPage + 1) }
                        >
                            Next
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
