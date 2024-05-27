"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWishlist } from "@/store/use-wishlist"
import { ShoppingCart, X } from "lucide-react"
import Image from "next/image"

export const Wishlist = () => {
    const {wishlist} = useWishlist()
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>View and manage the items in your wishlist.</CardDescription>
            </CardHeader>
            <CardContent>
                {
                    wishlist.map(item => (
                        <div className="grid gap-4" key={item.id}>
                            <div className="flex items-center gap-4">
                                <Image
                                    alt={item.name}
                                    className="rounded-md"
                                    height={64}
                                    src={item.featureImageUrl}
                                    style={{
                                        aspectRatio: "64/64",
                                        objectFit: "cover",
                                    }}
                                    width={64}
                                />
                                <div className="hidden md:block">
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.discountPrice || item.price}</p>
                                </div>
                                <div className="ml-auto flex flex-col md:flex-row gap-2">
                                    <Button size="sm" variant="outline" className="flex items-center gap-x-1">
                                        <ShoppingCart className="h-5 w-5" />
                                        Cart
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                        <X className="w-4 h-4" />
                                        <span className="sr-only">Remove from Wishlist</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    )
}