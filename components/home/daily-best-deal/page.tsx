"use client"

import { CirclePercent } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"

import { BestDealCard, ProductCartSkeleton } from "../card/best-deal-card"
import { GET_POPULAR_PRODUCTS } from "@/actions/product.action"

export const DailyBestDeal = () => {
    const { data: products, isFetching } = useQuery({
        queryKey: ["get-popular"],
        queryFn: async () => {
            const { products } = await GET_POPULAR_PRODUCTS();
            return products;
        },
        staleTime: 60 * 60 * 1000
    })

    return (
        <div className="w-full max-w-screen-xl mx-auto bg-white p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <CirclePercent className="w-7 h-7 text-primary" />
                    <h1 className="text-xl font-semibold text-slate-700">Daily Best Deal</h1>
                </div>
                <Button className="rounded-full">See All</Button>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-4">
                {
                    isFetching ?
                        Array.from({ length: 6 }, (_, index) => (
                            <ProductCartSkeleton key={index} />
                        ))
                        :
                        products?.map(product => (
                            <BestDealCard product={product} />
                        ))
                }
            </div>
        </div>
    )
} 