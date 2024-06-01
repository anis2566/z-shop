"use client"

import { GET_USER_ORDER } from "@/actions/order.action"
import { Header } from "@/components/home/account/orders/header"
import { OrderList } from "@/components/home/account/orders/order-list"
import { PaginationComp } from "@/components/pagination-comp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { OrderSkeleton } from "../page"

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        status: string;
    }
  };

const Orders = ({searchParams}:Props) => {
    const {page, perPage, status} = searchParams;
    
    const { data:orders, error, isLoading } = useQuery({
        queryKey: ["user-orders", page, perPage, status],
        queryFn: async () => {
            const res = await GET_USER_ORDER({ page, perPage, status })
            return res.orders
        },
    })
    
    const totalPage = 4

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Explore your order list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? 
                    <OrderSkeleton />
                    : 
                    orders && <OrderList orders={orders} />
                }
                <PaginationComp totalPage={totalPage} />
            </CardContent>
        </Card>
    )
}

export default Orders