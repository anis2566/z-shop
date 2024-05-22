import { format } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";
import { SellerOrder, SellerOrderProduct } from "@prisma/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Header } from "./header";
import { PaginationComp } from "@/components/pagination-comp";

interface OrdersWithProduct extends SellerOrderProduct {
    product: {
        featureImageUrl: string;
    },
}

interface OrderWithSeller extends SellerOrder {
    products: OrdersWithProduct[],
    seller: {
        name: string;
    }
}

interface Props {
    orders: OrderWithSeller[];
    totalPage: number
}

export const SellerOrdes = ({orders, totalPage}:Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Seller</TableHead>
                        <TableHead className="">Customer</TableHead>
                        <TableHead className="">Product</TableHead>
                        <TableHead className="">Total</TableHead>
                        <TableHead className="">Date</TableHead>
                        <TableHead className="">Tracking Id</TableHead>
                        <TableHead className="">Status</TableHead>
                        <TableHead className="">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="py-2">{order.customerName}</TableCell>
                                <TableCell className="py-2">{order.seller.name}</TableCell>
                                    <TableCell className="py-2">
                                        {
                                            order.products.map((item) => (
                                                <Avatar className="w-9 h-9" key={item.id}>
                                                    <AvatarImage src={item.product.featureImageUrl} />
                                                    <AvatarFallback>{order.customerName}</AvatarFallback>
                                                </Avatar>
                                            ))
                                        }
                                </TableCell>
                                <TableCell className="py-2">{order.total + order.deliveryFee}</TableCell>
                                <TableCell className="py-2">{format(order.createdAt, "dd MMMM yyyy")}</TableCell>
                                <TableCell className="py-2">{order.trackingId || "-"}</TableCell>
                                    <TableCell className="py-2">
                                        <Badge
                                            className={cn("capitalize text-white",
                                                order.status === "pending" && "bg-amber-500",
                                                order.status === "shipping" && "bg-indigo-500",
                                                order.status === "delivered" && "bg-green-500",
                                                order.status === "returned" && "bg-rose-500",
                                            )}
                                        >
                                            {order.status}
                                        </Badge>
                                </TableCell>
                                <TableCell className="py-2">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/dashboard/sellers/orders/${order.id}`}>
                                                <Eye className="text-primary w-5 h-5" />
                                            </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <PaginationComp totalPage={totalPage} />
            </CardContent>
        </Card>
    )
}