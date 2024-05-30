"use client"

import Image from "next/image"
import { format } from "date-fns"
import Link from "next/link"
import { Eye } from "lucide-react"
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

import { Wishlist } from "@/components/home/navbar/wishlist"
import { Review } from "@/components/home/account/review"
import { getUser } from "@/service/user.service"
import { GET_USER_ORDER } from "@/actions/order.action"
import { cn } from "@/lib/utils"

const Account = () => {

    const { data: user, isFetching } = useQuery({
        queryKey: ["get-user"],
        queryFn: async () => {
            const res = await getUser()
            return res.user
        },
        staleTime: 60 * 60 * 1000
    })

    const { data: orders, isFetching: isFetchingOrders } = useQuery({
        queryKey: ["user-orders"],
        queryFn: async () => {
            const res = await GET_USER_ORDER()
            return res.orders
        },
        staleTime: 60 * 60 * 1000
    })

    return (
        <div className="space-y-10 flex-1">
            {isFetching ? (
                <AccountSkeleton />
            ) : user ? (
                <Card className="w-full">
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="60"
                            src={user?.imageUrl || ""}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="60"
                        />
                        <div className="grid gap-1 text-sm md:gap-2">
                            <div className="font-semibold text-xl">{`${user.name?.split(" ")[0]}`} <span className="text-primary">{user.name?.split(" ")[1]}</span></div>
                            <div>{user.email}</div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}


            {
                isFetchingOrders ? <OrderSkeleton /> :
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
                                                <TableRow className="p-0">
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


const AccountSkeleton = () => {
    return (
        <Card className="w-full">
            <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                <Skeleton className="h-[60px] w-[60px] rounded-full" />
                <div className="grid gap-1 text-sm md:gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardContent>
        </Card>
    )
}


const OrderSkeleton = () => {
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
                            Array.from({ length: 3 }, (_, i) => (
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