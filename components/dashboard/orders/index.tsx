import { Order, OrderProduct } from "@prisma/client"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface OrderWithProduct extends OrderProduct {
    product: {
        featureImageUrl: string;
    }
}

interface OrderWithProductAndUser extends Order {
    products: OrderWithProduct[],
    user: {
        name: string;
    }
}

interface Props {
    orders: OrderWithProductAndUser[]
}

export const OrderList = ({ orders }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Product</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="py-3 px-1 flex items-center justify-center gap-x-1">
                                {
                                    order.products.map((item, i) => (
                                        <Avatar className="w-8 h-8" key={i}>
                                            <AvatarImage src={item.product.featureImageUrl} />
                                            <AvatarFallback>PS</AvatarFallback>
                                        </Avatar>
                                    ))
                                }
                            </TableCell>
                            <TableCell className="py-3 px-1 text-center">{order.user.name}</TableCell>
                            <TableCell className="py-3 px-1 text-center">{order.total + order.deliveryFee}</TableCell>
                            <TableCell className="py-3 px-1 text-center">{format(order.createdAt, "dd MMMM yyyy")}</TableCell>
                            <TableCell className="py-3 flex justify-center">
                                <Badge
                                    className={cn("capitalize",
                                        order.status === "pending" && "bg-amber-500",
                                        order.status === "shipping" && "bg-indigo-500",
                                        order.status === "delivered" && "bg-green-500",
                                        order.status === "returned" && "bg-rose-500",
                                    )}
                                >
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-3 px-1 py-3 text-center">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/dashboard/orders/${order.id}`}>
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