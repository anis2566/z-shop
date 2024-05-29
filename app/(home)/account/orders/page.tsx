import { Header } from "@/components/home/account/orders/header"
import { OrderList } from "@/components/home/account/orders/order-list"
import { PaginationComp } from "@/components/pagination-comp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { getUser } from "@/service/user.service"

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        status: string;
    }
  };

const Orders = async ({searchParams}:Props) => {
    const {status} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const {userId} = await getUser()

    const orders = await db.order.findMany({
        where: {
            userId,
            ...(status !== "all" && {status})
        },
        include: {
            products: {
                include: {
                    product: {
                        select: {
                            featureImageUrl: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalOrder = await db.order.count({
        where: {
            userId
        }
    })

    const totalPage = totalOrder / itemsPerPage

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Explore your order list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                <OrderList orders={orders} />
                <PaginationComp totalPage={totalPage} />
            </CardContent>
        </Card>
    )
}

export default Orders