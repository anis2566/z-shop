import { Check, DollarSign, RefreshCcw, ShoppingCart, Truck } from "lucide-react"

import { BigCard } from "@/components/seller/home/big-card"
import { SmallCard } from "@/components/seller/home/small-card"
import { MostSaleProductChart } from "@/components/seller/home/most-sale-product-chart"
import { RecentOrders } from "@/components/seller/home/recent-orders"

const Dashboard = () => {
    return (
        <main className="flex flex-1 flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <BigCard title="Current Balance" icon={DollarSign} value={530} />
                <BigCard title="Pending Balance" icon={DollarSign} value={1560} />
                <BigCard title="Withdraw" icon={DollarSign} value={241644} />
                <BigCard title="Total Earning" icon={DollarSign} value={241644} />
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