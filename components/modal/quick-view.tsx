"use client"

import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { cn } from "@/lib/utils"
import { useProduct } from "@/store/use-product"
import { ProductInfo } from "@/components/home/product/product-details"


export const QuickViewModal = () => {
    const [activeImage, setActiveImage] = useState<string>("")

    const {open, onClose, product} = useProduct()

    useEffect(() => {
        setActiveImage(product?.featureImageUrl || "")
    }, [product?.featureImageUrl])
    
    return (
        <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[900px]">
            {product && (
            <div className="w-full px-3 mt-7 space-y-6">
                <div className="w-full flex gap-x-4">
                    <div className="w-full">
                        <div className="border border-gray-400 w-full max-w-[350px] mx-auto rounded-md flex items-center justify-center p-2">
                            {activeImage === "" ? (
                                <Loader className="h-8 w-8 animate-spin" />
                            ) : (
                                <Image
                                    alt="Product"
                                    className="w-full h-[300px] object-contain rounded-lg"
                                    src={activeImage}
                                    height="300"
                                    width="300"
                                />
                            )}
                        </div>
                        <div className="w-full px-2 mt-3">
                            <Carousel className="w-full max-w-sm mx-auto">
                                <CarouselContent className="">
                                    {[product.featureImageUrl, ...product.images].map((image, index) => {
                                        const active = image === activeImage
                                        return (
                                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                                                <div className="p-1">
                                                    <div className={cn("border border-gray-300 rounded-md aspect-square flex items-center justify-center", active && "border-gray-400 opacity-70")} onClick={() => setActiveImage(image)}>
                                                        <Image
                                                            alt="Product"
                                                            className="rounded-lg w-[50px] h-[50px]"
                                                            height="70"
                                                            src={image}
                                                            width="70"
                                                        />
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        )}
                                    )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </div>
                    <ProductInfo product={product}
                    />
                </div>
            </div>
            )}
        </DialogContent>
        </Dialog>
    )
}