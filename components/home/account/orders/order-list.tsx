import { Order, OrderProduct } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface OrderProductWithProduct extends OrderProduct {
    product: {
        featureImageUrl: string;
    }
}

interface SellerOrderWithProduct extends Order {
    products: OrderProductWithProduct[]
}

interface Props {
    orders: SellerOrderWithProduct[];
}

export const OrderList = ({ orders }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead >Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    orders.map(order => (
                        <TableRow className="p-0" key={order.id}>
                            <TableCell className="py-1 flex items-center gap-x-2">
                                {
                                    order.products.map(item => (
                                        <Avatar key={item.productId}>
                                            <AvatarImage src={item.product.featureImageUrl} />
                                            <AvatarFallback>P</AvatarFallback>
                                        </Avatar>
                                    ))
                                }
                            </TableCell>
                            <TableCell className="py-1">
                                {order.total + order.deliveryFee}
                            </TableCell>
                            <TableCell>
                                {format(order.createdAt, "dd MMMM yyyy")}
                            </TableCell>
                            <TableCell className="py-1">
                                <Badge
                                    className={cn("text-white",
                                        order.status === "pending" && "bg-amber-600",
                                        order.status === "shipping" && "bg-indogo-600",
                                        order.status === "delivered" && "bg-green-600",
                                        order.status === "returned" && "bg-rose-600",
                                    )}
                                >{
                                        order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-1">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/account/orders/${order.id}`}>
                                        <Eye className="w-5 h-5 text-primary" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}