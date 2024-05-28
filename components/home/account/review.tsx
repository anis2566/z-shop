import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { db } from "@/lib/db"

export const Review = async () => {
    const products = await db.product.findMany()

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>Submit reviews for the products you've purchased.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {
                        products.map(product => (
                            <div key={product.id} className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <Image
                                        alt={product.name}
                                        className="rounded-md"
                                        height={64}
                                        src={product.featureImageUrl}
                                        style={{
                                            aspectRatio: "64/64",
                                            objectFit: "cover",
                                        }}
                                        width={64}
                                    />
                                    <div>
                                        <h4 className="font-semibold">{product.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Purchased on March 15, 2023</p>
                                    </div>
                                    <div className="ml-auto hidden md:flex">
                                        <Button size="sm" variant="outline">
                                            Write Review
                                        </Button>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="md:hidden">
                                    Write Review
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}