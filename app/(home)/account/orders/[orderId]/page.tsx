import Image from "next/image";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { db } from "@/lib/db"

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {

    const order = await db.order.findUnique({
        where: {
            id: params.orderId
        },
        include: {
            products: {
                include: {
                    product: {
                        select: {
                            name: true,
                            featureImageUrl: true,
                            discountPrice: true,
                            price: true
                        }
                    }
                }
            },
            address: true,
        }
    })

    console.log(order)

    if (!order) redirect("/")

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 px-4">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Products</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {
                            order.products.map(item => (
                                <div className="border divide-y" key={item.productId}>
                                    <div className="flex flex-col sm:flex-row justify-between p-4">
                                        <div className="flex flex-col md:flex-row gap-x-2">
                                            <div className="aspect-square w-full max-w-[100px]">
                                                <Image
                                                    alt="Thumbnail"
                                                    className="aspect-object object-cover rounded-lg"
                                                    height="100"
                                                    src={item.product.featureImageUrl}
                                                    width="100"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-base">{item.product.name}</h3>
                                                <div className={cn("hidden items-center gap-2 text-sm", item.color && "flex")}>
                                                    <div className="font-medium capitalize">Color: {item.color}</div>
                                                </div>
                                                <div className={cn("hidden items-center gap-2 text-sm", item.size && "flex")}>
                                                    <div className="font-medium">Size: <span className="font-medium uppercase">{item.size}</span></div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="font-medium">Quantity: <span className="font-medium uppercase">{item.quantity}</span></div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="font-medium">Price: <span className="font-medium uppercase">{item.product.discountPrice || item.product.price}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p>{order.address?.recepient}</p>
                        <p>{order.address?.address}</p>
                        <p>{order.address?.phone}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-2">
                                <div>Total</div>
                                <div className="font-semibold">{order.total}</div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div>Delivery Fee</div>
                                <div className="font-semibold">{order.deliveryFee}</div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div>Sub Total</div>
                                <div className="font-semibold">{order.total + order.deliveryFee}</div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div>Status</div>
                                <div className="font-semibold">
                                    <Badge
                                        className={cn("text-white capitalize",
                                            order.status === "pending" && "bg-amber-600",
                                            order.status === "shipping" && "bg-indogo-600",
                                            order.status === "delivered" && "bg-green-600",
                                            order.status === "returned" && "bg-rose-600",
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default OrderDetails