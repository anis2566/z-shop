"use client"

import Image from "next/image"
import Link from "next/link";
import { TbCurrencyTaka } from "react-icons/tb";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

import { ProductWithFeature } from "@/@types";
import { useCart } from "@/store/use-cart";

interface Props {
    product: ProductWithFeature
}


export const BestDealCard = ({ product }: Props) => {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({ product, price: product.discountPrice || product.price, quantity: 1 })
        toast.success("Added to cart")
    }

    return (
        <div className="p-2 shadow-lg flex flex-col space-y-1 shadow-lx hover:shadow-xl border border-transparent hover:border-primary">
            <Link href={`/shop/${product.id}`}>
                <div className="aspect-square">
                    <Image
                        src={product.featureImageUrl}
                        alt={product.name}
                        width="200"
                        height="200"
                    />
                </div>
                <p className="text-md">
                    {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
                </p>
                <div className="flex items-center gap-x-3">
                    <div className="flex items-center text-primary font-bold">
                        <TbCurrencyTaka className="h-5 w-5" />
                        <p className="-ml-1">
                            {product.discountPrice || product.price}
                        </p>
                    </div>
                    <div className="flex items-center text-rose-500 line-through">
                        <TbCurrencyTaka className="h-5 w-5" />
                        <p className="-ml-1">
                            {product.price}
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <Progress value={(5 / (product.totalStock || 1)) * 100} className="h-1.5" />
                    <span className="text-xs text-muted-foreground">Sold: 5/{product?.totalStock}</span>
                </div>
            </Link>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>
    )
}


export const ProductCartSkeleton = () => {
    return (
        <div className="p-2 flex flex-col space-y-2">
            <Skeleton className="aspect-square" />
            <Skeleton className="w-[90%] h-10" />
            <Skeleton className="w-[70%] h-5" />
            <Skeleton className="w-full h-8" />
        </div>
    )
}