"use client"

import { Progress } from "@/components/ui/progress"
import { useQuery } from "@tanstack/react-query"
import { SmallCard, SmallCardSkeleton } from "@/components/home/card/small-card"
import { GET_TOP_SELLING_PRODUCTS } from "@/actions/product.action"

export const TopSelling = () => {
    const {data: products, isFetching} = useQuery({
        queryKey: ["get-top-selling"],
        queryFn: async () => {
            const res = await GET_TOP_SELLING_PRODUCTS()
            return res.products
        },
        staleTime: 60 * 60 * 1000
    })
    
    return (
        <div className="space-y-3 mt-10 md:mt-0">
            <p className="text-2xl font-semibold">Top Selling</p>
            <Progress value={0} className="w-[100px] h-1 bg-muted-foreground" />
            <div className="space-y-4">
                {
                    isFetching ? (
                        <>
                            <SmallCardSkeleton />
                            <SmallCardSkeleton />
                            <SmallCardSkeleton />
                        </>
                    ) : 
                    products && products.map(product => (
                        <SmallCard product={product} key={product.id} />
                    ))
                }
            </div>
        </div>
    )
}