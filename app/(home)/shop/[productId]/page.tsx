"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/ui/skeleton"

import { Preview } from "@/components/preview"
import { ProductInfo, ProductInfoSkeleton } from "@/components/home/product/product-details"
import { ProductImages, ProductImagesSkeleton } from "@/components/home/product/product-images"
import { GET_PRODUCT } from "@/actions/product.action"
import { Reviews } from "@/components/home/product/reviews"


const ProductDetails = ({ params }: { params: { productId: string } }) => {

    const { data: product, isFetching } = useQuery({
        queryKey: ["get-product", params.productId],
        queryFn: async () => {
            const res = await GET_PRODUCT(params.productId)
            return res.product
        },
        enabled: !!params.productId
    })


    return (
        <div className="w-full px-3 mt-7 space-y-6">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                    isFetching ? (
                        <>
                            <ProductImagesSkeleton />
                            <ProductInfoSkeleton />
                        </>
                    ) : product ? (
                        <>
                            <ProductImages featureImage={product.featureImageUrl} images={product.images} />
                            <ProductInfo product={product} />
                        </>
                    )
                        : null
                }
            </div>

            <Separator />

            <Tabs defaultValue="description" className="w-full flex flex-col items-center mt-2">
                <TabsList className="w-full max-w-[400px] mx-auto">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reveiws">Reveiws</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="w-full max-w-[1200px] mx-auto">
                    {
                        isFetching ? (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-1/2" />
                                <Skeleton className="h-10 w-1/2" />
                                <Skeleton className="h-10 w-1/2" />
                            </div>
                        ) : (
                            <Preview value={product?.description || ""} />
                        )
                    }
                </TabsContent>
                <TabsContent value="reveiws" className="w-full max-w-[1200px] mx-auto">
                    <Reviews />
                </TabsContent>
            </Tabs>

            {/* <RelatedProducts /> */}
        </div>
    )
}

export default ProductDetails;