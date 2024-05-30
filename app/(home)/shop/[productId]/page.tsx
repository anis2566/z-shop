"use client"

import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Preview } from "@/components/preview"
import { ProductInfo, ProductInfoSkeleton } from "@/components/home/product/product-details"
import { ProductImages, ProductImagesSkeleton } from "@/components/home/product/product-images"
import { GET_PRODUCT } from "@/actions/product.action"
import { Reviews } from "@/components/home/product/reviews"
import { RelatedProduct } from "@/components/home/product/related-product"


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
        <div className="w-full max-w-screen-xl mx-auto px-3 py-5 space-y-6">

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 bg-white py-3">
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

            <div className="bg-white py-3">
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
                        {
                            product && <Reviews productId={params.productId} product={product} />
                        }
                    </TabsContent>
                </Tabs>
            </div>

            <RelatedProduct />
        </div>
    )
}

export default ProductDetails;