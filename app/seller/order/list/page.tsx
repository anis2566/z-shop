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
  }
};

const OrderListComp = async ({ searchParams }: SearchPageProps) => {
    const page = parseInt(searchParams.page)
    const perPage = parseInt(searchParams.perPage)

    const { sellerId } = await getSeller()
    
    const orders = await db.sellerOrder.findMany({
        where: {
            sellerId
        }
    })

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

            <OrderList orders={orders} />
        </div>
    )
}

export default OrderListComp