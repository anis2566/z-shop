import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { db } from "@/lib/db"
import { SellerList } from "@/components/dashboard/sellers/seller-list";

interface Props {
  searchParams: {
      status: string;
      page: string;
      perPage: string;
      search: string;
  }
};

const SellerRequests = async ({ searchParams }: Props) => {
    const {search, status} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const sellers = await db.seller.findMany({
        where: {
            ...(status !== "all" ? {status} : {status: {not: "pending"}}),
            ...(search && {name: {contains: search, mode: "insensitive"}})
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalSeller = await db.seller.count({
        where: {
            ...(status !== "all" ? {status} : {status: {not: "pending"}}),
            ...(search && {name: {contains: search, mode: "insensitive"}})
        },
    }) 

    const totalPage = Math.ceil(totalSeller / itemsPerPage)

    return (
        <div className="w-full space-y-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Sellers</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <SellerList sellers={sellers} totalPage={totalPage} />
        </div>
    )
}

export default SellerRequests