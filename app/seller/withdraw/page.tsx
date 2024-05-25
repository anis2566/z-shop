import { redirect } from "next/navigation"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { getSeller } from "@/service/user.service"
import { db } from "@/lib/db"
import { WithdrawButton } from "@/components/seller/withdraw/withdraw-button"
import { WithdrawList } from "@/components/seller/withdraw/withdraw-list"

interface Props {
    searchParams: {
        page: string;
        status: string;
        perPage: string;
    }
}

const Withdraw = async ({ searchParams }: Props) => {
    const { status } = searchParams;
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const { sellerId } = await getSeller()
    const bank = await db.bank.findUnique({
        where: {
            sellerId
        }
    })

    if (!bank) redirect("/")
    
    const withdraws = await db.withdraw.findMany({
        where: {
            sellerId,
            ...(status !== "all" && {status})
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalWithdraw = await db.withdraw.count({
        where: {
            sellerId,
            ...(status !== "all" && {status})
        },
    })

    const totalPage = totalWithdraw / itemsPerPage

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Brand</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <WithdrawButton />
            </div>

            <div>
                <p className="text-xl font-bold text-muted-foreground">Available Balance</p>
                <p className="text-md">BDT {bank.current}</p>
            </div>

            <WithdrawList withdraws={withdraws} totalPage={totalPage} />
        </div>
    )
}

export default Withdraw