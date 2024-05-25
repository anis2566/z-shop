import Image from "next/image"
import { redirect } from "next/navigation"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { db } from "@/lib/db"
import SellerOrders from "@/components/dashboard/sellers/seller-details/orders"
import { cn } from "@/lib/utils"
import { MostSaleProductChart } from "@/components/dashboard/sellers/seller-details/most-sale-product-chart"

interface Props {
    params: {
        sellerId: string;
    },
    searchParams: {
      status: string;
      page: string;
      perPage: string;
      date: Date;
    }
}

const SellerDetails = async ({ params, searchParams }: Props) => {
    const {status, date:dateString} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const date = dateString ? new Date(dateString) : null;
    
    const seller = await db.seller.findUnique({
        where: {
            id: params.sellerId
        }
    })

    if (!seller) redirect("/dashboard")

    const orders = await db.sellerOrder.findMany({
        where: {
            sellerId: params.sellerId,
            ...(date && {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), 
                    lt: new Date(date.setHours(23, 59, 59, 999)) 
                }
            }),
            ...(status !== "all" && { status })
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

    const totalOrder = await db.sellerOrder.count({
        where: {
            sellerId: params.sellerId,
            ...(date && {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), 
                    lt: new Date(date.setHours(23, 59, 59, 999)) 
                }
            }),
            ...(status !== "all" && { status })
        }
    })

    const mostSoldProducts = await db.sellerOrderProduct.groupBy({
        by: ['productId'],
        where: {
            order: {
                sellerId: params.sellerId,
            },
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 5,
    }).then(results => Promise.all(results.map(async result => {
        const product = await db.product.findUnique({ where: { id: result.productId } });
        return {
            name: product?.name || "",
            sales: result._sum.quantity ?? 0,
        };
    })));

    const totalPage = totalOrder / itemsPerPage

    return (
        <div className="w-full space-y-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/sellers">Sellers</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                    <Image
                        alt="Avatar"
                        className="rounded-full"
                        height="100"
                        src={seller.imageUrl}
                        style={{
                            aspectRatio: "100/100",
                            objectFit: "cover",
                            }}
                        width="100"
                    />
                    <div className="space-y-1">
                        <div className="font-semibold text-xl">Hello, <span className="text-primary">{seller.name}</span></div>
                        <div>{seller.email}</div>
                        <div>{seller.phone}</div>
                        <Badge
                            className={cn("capitalize text-white",
                                seller.status === "pending" && "bg-amber-500",
                                seller.status === "active" && "bg-green-500",
                                seller.status === "inactive" && "bg-rose-500",
                            )}
                        >
                            {seller.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <div className="md:col-span-2">
                    <SellerOrders orders={orders} totalPage={totalPage} />
                </div>
                <div className="min-h-[300px]">
                    <MostSaleProductChart products={mostSoldProducts} />
                </div>
            </div>
        </div>
    )
}

export default SellerDetails