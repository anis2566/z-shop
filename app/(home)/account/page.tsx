"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Eye, ShoppingCart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import { Review } from "@/components/home/account/review"
import { GET_USER_ORDER } from "@/actions/order.action"
import { cn } from "@/lib/utils"
import { GET_USER_DASHBOARD_DATA } from "@/actions/user.action"
import { Wishlist } from "@/components/home/account/wishlist"

const Account = () => {

    const {data:dashbaordData, isFetching} = useQuery({
        queryKey: ["dashboard-data"],
        queryFn: async () => {
            const res = await GET_USER_DASHBOARD_DATA()
            return res
        },
        staleTime: 60 * 60 * 1000
    })

    const { data: orders, isFetching: isFetchingOrders } = useQuery({
        queryKey: ["user-orders-dashboard"],
        queryFn: async () => {
            const res = await GET_USER_ORDER({page: "1", perPage: "3", status: "all"})
            return res.orders
        },
        staleTime: 60 * 60 * 1000
    })

    return (
        <div className="space-y-10 flex-1">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isFetching ? (
                            <Skeleton className="h-6 w-12" />
                        ) : (

                            <div className="text-xl font-bold">{dashbaordData?.totalOrders}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isFetching ? (
                            <Skeleton className="h-6 w-12" />
                        ) : (

                            <div className="text-xl font-bold">{dashbaordData?.pendingOrder}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Delivered Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isFetching ? (
                            <Skeleton className="h-6 w-12" />
                        ) : (

                            <div className="text-xl font-bold">{dashbaordData?.deliveredOrder}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {
                isFetchingOrders ? <OrderSkeleton limit={3} /> :
                    orders && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Explore your lates orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">Products</TableHead>
                                            <TableHead className="text-center">Total</TableHead>
                                            <TableHead className="text-center">Date</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            orders.map(order => (
                                                <TableRow className="p-0" key={order.id}>
                                                    <TableCell className="py-1 flex justify-center gap-x-2">
                                                        {
                                                            order.products.map((item, i) => (
                                                                <Avatar key={i}>
                                                                    <AvatarImage src={item.product.featureImageUrl} />
                                                                    <AvatarFallback>U</AvatarFallback>
                                                                </Avatar>
                                                            ))
                                                        }
                                                    </TableCell>
                                                    <TableCell className="py-1 text-center">
                                                        {order.total}
                                                    </TableCell>
                                                    <TableCell className="py-1 text-center">
                                                        {format(order.createdAt, "dd MMMM yyyy")}
                                                    </TableCell>
                                                    <TableCell className="py-1 text-center">
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
                                                    <TableCell className="py-1 text-center">
                                                        <Link href={`/account/orders/${order.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="w-5 h-5 text-primary" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Wishlist />
                <Review />
            </div>
        </div>
    )
}

export default Account

export const OrderSkeleton = ({limit}:{limit:number}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Explore your lates orders</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Products</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            Array.from({ length: limit}, (_, i) => (
                                <TableRow className="p-0" key={i}>
                                    <TableCell className="py-1 flex justify-center gap-x-2">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}