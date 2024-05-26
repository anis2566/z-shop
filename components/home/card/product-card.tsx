"use client"

import Image from "next/image"
import { useState } from "react" 
import {Eye, Heart, ShoppingCart, StarIcon} from "lucide-react"
import Link from "next/link"
import toast from 'react-hot-toast';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { calculateDiscountPercentage, cn } from "@/lib/utils"
import { ProductWithFeature } from "@/@types"
import { useProduct } from "@/store/use-product"
import { useCart } from "@/store/use-cart"
import { useWishlist } from "@/store/use-wishlist"

interface ProductCardProps {
    product: ProductWithFeature;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const {onOpen} = useProduct()
    const {addToCart} = useCart()
    const {addToWishlist} = useWishlist()
    
    const handleAddToCart = () => {
        addToCart({product, price: product.discountPrice || product.price, quantity:1})
        toast.success("Added to cart")
    }

    const handleAddToWishlist = () => {
        addToWishlist(product)
        toast.success("Added to wishlist")
    }

    return (
        <div className="p-3 border border-gray-200 rounded-md w-full max-w-[300px] min-h-[350px] relative space-y-2 overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-md" onMouseEnter={() => setIsHovered(true)} onMouseLeave={()  => setIsHovered(false)}>
            {product.discountPrice && (
                <Badge className="absolute -left-2 top-4 bg-amber-500 -rotate-45">{calculateDiscountPercentage(product.price, product.discountPrice)}% off</Badge>
            )}

            <Link href={`/shop/${product.id}`} className="space-y-2">
                <div className="aspect-square w-full max-w-[100px] mx-auto relative">
                    <Image
                        alt="Thumbnail"
                        className={cn("h-[120px] rounded-lg group-hover:scale-110 transition-all duration-300 ease-in-out absolute top-0 left-0", isHovered && "translate-x-52 opacity-0")}
                        height="100"
                        src={product.featureImageUrl}
                        width="100"
                    />
                    <Image
                        alt="Thumbnail"
                        className={cn("h-[120px] rounded-lg group-hover:scale-110 transition-all duration-300 ease-in-out -translate-x-52 absolute top-0 left-0 opacity-0", isHovered && "translate-x-0 opacity-1")}
                        height="100"
                        src={product.images[0]}
                        width="100"
                    />
                </div>

                <Badge className="text-muted-foreground" variant="outline">{product.category.name}</Badge>

                <p className="font-semibold">{product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}</p>

                {   
                    product.brand && (
                        <div className="flex items-center gap-x-2">
                            <Image
                                alt="Brand"
                                className="w-6 h-6 rounded-full object-cover"
                                height="100"
                                src={product.brand.imageUrl}
                                width="100"
                            />
                            <Badge variant="outline">{product.brand.name}</Badge>
                        </div>
                    )
                }
                
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center gap-0.5">
                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <StarIcon className="w-4 h-4 fill-muted stroke-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">(4.0)</p>
                </div>

                {product.discountPrice ? (
                    <div className="flex items-center gap-x-2">
                        <p className="text-slate-700 text-md font-semibold">&#2547;{product.discountPrice}</p>
                        <p className="text-slate-700 line-through text-sm">&#2547;{product.price}</p>
                    </div>
                ): (
                    <p className="text-slate-700 line-through text-md">&#2547;{product.price}</p>
                )}
            </Link>

            <div className="flex items-center justify-between absolute bottom-2 left-0 w-full px-2">
                <p className="text-sm text-muted-foreground">{product.totalStock} (stock)</p>
                <Button className="flex items-center gap-x-2" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5" />
                    Add
                </Button>
            </div>

            {/* OVERLAY */}
            <div className="absolute -right-20 top-0 group-hover:right-0 border border-gray-500 rounded-tl-xl rounded-bl-xl p-1 transition-all duration-300 ease-in-out hidden md:flex md:flex-col">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => onOpen(product)}>
                                <Eye className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                        <p>Quick View</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={handleAddToWishlist}>
                                <Heart className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                        <p>Add to wishlist</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}



export const ProductCardSkeleton = () => {
    return (
        <div className="p-3 border border-gray-200 rounded-md w-full max-w-[300px] min-h-[350px] relative space-y-2 overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-md">
            <div className="space-y-2">
                <Skeleton className="aspect-square w-full max-w-[100px] mx-auto relative rounded-lg" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <div className="flex items-center gap-x-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="flex items-center gap-0.5">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="w-4 h-4 rounded" />
                    </div>
                    <Skeleton className="h-4 w-1/6" />
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                </div>
            </div>
            <div className="flex items-center justify-between absolute bottom-2 left-0 w-full px-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
            </div>
        </div>
    )
}