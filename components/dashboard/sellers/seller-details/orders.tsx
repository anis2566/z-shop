import { SellerOrder, SellerOrderProduct } from "@prisma/client"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { Header } from "./header"
import { cn } from "@/lib/utils"
import { PaginationComp } from "@/components/pagination-comp"

interface OrderWithProduct extends SellerOrderProduct {
    product: {
        featureImageUrl: string;
    }
}

interface SellerOrderWithProduct extends SellerOrder {
    products: OrderWithProduct[]
}

interface Props {
    orders: SellerOrderWithProduct[];
    totalPage: number;
}

export const SellerOrders = async ({orders, totalPage}:Props) => {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">INVOICE</TableHead>
                            <TableHead className="">Product</TableHead>
                            <TableHead className="">Price</TableHead>
                            <TableHead className="">Date</TableHead>
                            <TableHead className="">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="py-2">{order.invoiceId}</TableCell>
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

export default SellerOrders