"use client"

import { useQuery } from "@tanstack/react-query"
import { DealOfTheDayCard, DealOfTheDayCardSkeleton } from "@/components/home/card/deal-of-the-day-card"
import { GET_DEAL_OF_THE_DAY_PRODUCTS } from "@/actions/product.action"

export const DealOfTheDay = () => {
  const {data: products, isFetching} = useQuery({
    queryKey: ["get-deal-of-the-day"],
    queryFn: async () => {
      const res = await GET_DEAL_OF_THE_DAY_PRODUCTS()
      return res.products
    },
    staleTime: 60 * 60 * 1000
  })
    
  return (
    <div className="w-full px-4 space-y-5 pb-9">
      <h1 className="text-xl md:text-2xl font-bold text-slate-600">Deal of the Day</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-8 gap-y-[170px] md:gap-y-0">
        {
          isFetching ? (
            Array.from({ length: 3 }).map((_, index) => (
              <DealOfTheDayCardSkeleton key={index} />
            ))
          ) : 
          products && products.map(product => (
            <DealOfTheDayCard key={product.id} product={product} />
          ))
        }
      </div>
    </div>
  )
}
