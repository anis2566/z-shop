"use client"

import { GET_CATEGORIES } from "@/actions/category.action";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { CategorySlider } from "./category-slider";

export function FeatureCategory  () {
  
    const {data: categories, isFetching} = useQuery({
        queryKey: ["feature-category"],
        queryFn: async () => {
            const res = await GET_CATEGORIES()
            return res.categories
        },
        staleTime: 60 * 60 * 1000
    })


  return (
      <div className="w-full px-4 space-y-6 relative">
          <h1 className="text-md md:text-2xl font-bold text-slate-600">Feature Categories</h1>
          <CategorySlider categories={categories ?? []} isLoading={isFetching} />
    </div>
  )
}