import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// import {Header} from "@/components/dashboard/order/header"
// import { OrderList } from "@/components/dashboard/order/order-list"
// import { db } from "@/lib/db";
// import { Pagination } from "@/components/dashboard/quick-orders/pagination";

interface Props {
    searchParams: {
        search: string;
        perPage: string;
        page: string;
        status: string;
    }
}

const Orders = async ({ searchParams }: Props) => {
    const { search, perPage, page, status } = searchParams;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(perPage);

    // const orders = await db.order.findMany({
    //     where: {
    //         ...(status !== "ALL" && { status }),
    //         ...(search && {
    //             shippingInfo: {
    //                 name: {
    //                     contains: search, mode: "insensitive"
    //                 }
    //             }
    //         })
    //     },
    //     include: {
    //         shippingInfo: {
    //             select: {
    //                 name: true
    //             }
    //         },
    //         products: {
    //             include: {
    //                 product: {
    //                     select: {
    //                         featureImageUrl: true
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     orderBy: {
    //         createdAt: "desc"
    //     },
    //     skip: (pageNumber - 1) * pageSize || 0,
    //     take: pageSize || 5
    // })


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
            {/* <Header />
            <OrderList orders={orders} />
            <Pagination /> */}
        </div>
    )
}

export default Orders