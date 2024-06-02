"use client"

import { useQuery } from "@tanstack/react-query"

import { GET_PRODUCTS } from "@/actions/product.action"
import { ProductCard, ProductCartSkeleton } from "@/components/home/card/product-card"
import { Filter } from "@/components/home/shop/filter"
import { FilterSort } from "@/components/home/shop/filter-sort"
import { PaginationComp } from "@/components/pagination-comp"

interface Props {
    searchParams: {
        search: string;
        category: string;
        minPrice: string;
        maxPrice: string;
        brand: string;
        sort: string;
        page: string;
    }
}

const Shop = ({ searchParams }: Props) => {

    const {search, category, minPrice, maxPrice, brand, sort, page} = searchParams


    const { data, isLoading } = useQuery({
        queryKey: ["get-products", search, category, minPrice, maxPrice, brand, sort, page],
        queryFn: async () => {
            const res = await GET_PRODUCTS({ search, category, minPrice, maxPrice, brand, sort, page })
            return res
        }
    })

    return (
        <div className="w-full max-w-screen-xl mx-auto my-6 bg-white p-4">
            <div className="flex gap-x-2">
                <Filter />
                <div className="space-y-8 flex-1">
                    <div className="flex items-center justify-between gap-4">
                        <div className="md:hidden">
                            {/* <FilterDrawer /> */}
                        </div>
                        <h1 className="hidden md:flex text-xl font-semibold">Products</h1>
                        <FilterSort />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {
                            isLoading ?
                                Array.from({ length: 8 }, (_, index) => (
                                    <ProductCartSkeleton key={index} />
                                ))
                                :
                                data?.products?.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                        }
                    </div>
                    <PaginationComp totalPage={Math.ceil((data?.totalProduct ?? 0) / 10)} />
                </div>
            </div>
        </div>
    )
}

export default Shop