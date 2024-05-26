import { redirect } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {db} from "@/lib/db"
// import {RelatedProducts} from "@/components/product/related-products"
// import {Reviews} from "@/components/product/reviews"
import {Preview } from "@/components/preview"
import { ProductInfo } from "@/components/home/product/product-details"
import { ProductImages } from "@/components/home/product/product-images"
import { Reviews } from "@/components/home/product/reviews"


const ProductDetails = async ({params}:{params:{productId:string}}) => {
    const product = await db.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            brand: true,
            stocks: true,
            category: true,
        }
    })

    if(!product) redirect("/")

    return (
        <div className="w-full px-3 mt-7 space-y-6">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductImages featureImage={product.featureImageUrl} images={product.images} />
                <ProductInfo product={product} />
            </div>

            <Separator />

            <Tabs defaultValue="description" className="w-full flex flex-col items-center mt-2">
                <TabsList className="w-full max-w-[400px] mx-auto">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reveiws">Reveiws</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="w-full max-w-[1200px] mx-auto">
                    <Preview value={product.description} />
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