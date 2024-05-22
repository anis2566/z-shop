import { OrderList } from "@/components/seller/orders";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
// import {OrderList} from "@/components/seller/order-list"

import { db } from "@/lib/db"
import { getSeller, getUser } from "@/service/user.service";
import { redirect } from "next/navigation";
// import { getUserId } from "@/service/user.service";

interface SearchPageProps {
  searchParams: {
      status: string;
      page: string;
      perPage: string;
      search: string;
      date: Date;
  }
};

const OrderListComp = async ({ searchParams }: SearchPageProps) => {
    const {search, status, date:dateString} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const { sellerId } = await getSeller()
    
    const date = dateString ? new Date(dateString) : null;

    const orders = await db.sellerOrder.findMany({
        where: {
            sellerId,
            ...(search && {
                customerName: {
                    contains: search, mode: "insensitive"
                }
            }),
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
    });

    const totalOrders = await db.sellerOrder.count({
        where: {
            sellerId,
            ...(search && {
                customerName: {
                    contains: search, mode: "insensitive"
                }
            }),
            ...(date && {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), 
                    lt: new Date(date.setHours(23, 59, 59, 999)) 
                }
            }),
            ...(status !== "all" && { status })
        }
    })

    const totalPage = totalOrders / itemsPerPage

    return (
        <div className="w-full space-y-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/seller">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <OrderList orders={orders} totalPage={totalPage} />
        </div>
    )
}

export default OrderListComp