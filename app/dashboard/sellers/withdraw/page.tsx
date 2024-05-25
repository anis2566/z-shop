import { WithdrawList } from "@/components/dashboard/sellers/withdraw/withdraw-list"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { db } from "@/lib/db"

interface Props {
  searchParams: {
      page: string;
      perPage: string;
      search: string;
      status: string;
  }
};

const Withdraw = async ({ searchParams }: Props) => {
    const {search, status} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const withdraws = await db.withdraw.findMany({
        where: {
            ...(status !== "all" && { status }),
            ...(search && {
                seller: {
                    name: {contains: search, mode: "insensitive"}
                }
            })
        },
        include: {
            seller: {
                select: {
                    name: true,
                    imageUrl: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalWithdraw = await db.withdraw.count({
        where: {
          ...(status !== "all" && { status }),
            ...(search && {
                seller: {
                    name: {contains: search, mode: "insensitive"}
                }
            })  
        }
    })

    const totalPage = totalWithdraw / itemsPerPage

    return (
        <div className="w-full space-y-6">
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
                    <BreadcrumbPage>Withdraw</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <WithdrawList withdraws={withdraws} totalPage={totalPage} />
        </div>
    )
}

export default Withdraw