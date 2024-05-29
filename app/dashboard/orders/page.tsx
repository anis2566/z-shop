import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { OrderList } from "@/components/dashboard/orders";
import { db } from "@/lib/db";
import { Header } from "@/components/dashboard/orders/header";
import { PaginationComp } from "@/components/pagination-comp";

interface Props {
    searchParams: {
        search: string;
        perPage: string;
        page: string;
        status: string;
        date: Date;
    }
}

const Orders = async ({ searchParams }: Props) => {
    const { search, perPage, page, status, date: dateString } = searchParams;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(perPage) || 5

    const date = dateString ? new Date(dateString) : null;

    const orders = await db.order.findMany({
        where: {
            ...(status !== "all" && { status }),
            ...(search && {
                address: {
                    recepient: {
                        contains: search, mode: "insensitive"
                    }
                }
            }),
            ...(date && {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999))
                }
            }),
        },
        include: {
            user: {
                select: {
                    name: true
                }
            },
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
        skip: (pageNumber - 1) * pageSize || 0,
        take: pageSize
    })

    const totalOrder = await db.order.count({
        where: {
            ...(status !== "all" && { status }),
            ...(search && {
                address: {
                    recepient: {
                        contains: search, mode: "insensitive"
                    }
                }
            }),
            ...(date && {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999))
                }
            }),
        }
    })

    const totalPage = totalOrder / pageSize

    return (
        <div className="w-full space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashobard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <OrderList orders={orders} />
                    <PaginationComp totalPage={totalPage} />
                </CardContent>
            </Card>
        </div>
    )
}

export default Orders