"use client"

import { GET_DAILY_BEST_DEAL_PRODUCTS } from "@/actions/product.action";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "./slider";

export const DailyBestDeal = () => {
    const { data: products = [], isFetching } = useQuery({
        queryKey: ["get-popular"],
        queryFn: async () => {
            const { products } = await GET_DAILY_BEST_DEAL_PRODUCTS();
            return products;
        },
        staleTime: 60 * 60 * 1000
    });

    return (
        <div className="w-full px-4 space-y-5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-600">Daily Best Deal</h1>
            <Slider products={products} isFetching={isFetching} />
        </div>
    )
}