import { Check, DollarSign, RefreshCcw, ShoppingCart, Truck } from "lucide-react"

import { BigCard } from "@/components/seller/home/big-card"
import { SmallCard } from "@/components/seller/home/small-card"
import { MostSaleProductChart } from "@/components/seller/home/most-sale-product-chart"
import { RecentOrders } from "@/components/seller/home/recent-orders"
import { getSeller } from "@/service/user.service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const Dashboard = async () => {
    const { sellerId } = await getSeller()
    const bank = await db.bank.findUnique({
        where: {
            sellerId
        }
    })

    if(!bank) redirect("/")

    return (
        <main className="flex flex-1 flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <BigCard title="Current Balance" icon={DollarSign} value={bank.current} />
                <BigCard title="Pending Balance" icon={DollarSign} value={bank.pending} />
                <BigCard title="Withdraw" icon={DollarSign} value={bank.withdraw} />
                <BigCard title="Total Earning" icon={DollarSign} value={bank.total} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <SmallCard title="Today Orders" icon={ShoppingCart} value={34} />
                <SmallCard title="Order Pending" icon={RefreshCcw} value={89} />
                <SmallCard title="Order Delivered" icon={Truck} value={25} />
                <SmallCard title="Order Returned" icon={Check} value={20} />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-8">
                <RecentOrders />
                <MostSaleProductChart />
            </div>
        </main>
    )
}

export default Dashboard