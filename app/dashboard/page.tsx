import { Check, CreditCard, DollarSign, RefreshCcw, ShoppingCart, Truck, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { BigCard } from "@/components/dashboard/home/big-card"
import { SmallCard } from "@/components/dashboard/home/small-card"
import { WeeklyCharts } from "@/components/dashboard/home/weekly-charts"
import { MostSaleProductChart } from "@/components/dashboard/home/most-sale-product-chart"
import { RecentOrders } from "@/components/dashboard/home/recent-orders"
import { Withdraw } from "@/components/dashboard/home/withdraw"
import { db } from "@/lib/db"

const Dashboard = async () => {

    const withdraws = await db.withdraw.findMany({
        include: {
            seller: {
                select: {
                    imageUrl: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 3
    })

    return (
        <main className="flex flex-1 flex-col gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <BigCard title="Today Orders" icon={DollarSign} value={530} />
                <BigCard title="Yesterday Orders" icon={DollarSign} value={1560} />
                <BigCard title="This Month" icon={CreditCard} value={241644} />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sellers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">43</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <SmallCard title="Today Orders" icon={ShoppingCart} value={34} />
                <SmallCard title="Order Pending" icon={RefreshCcw} value={89} />
                <SmallCard title="Order Delivered" icon={Truck} value={25} />
                <SmallCard title="Order Returned" icon={Check} value={20} />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-8">
                <WeeklyCharts />
                <MostSaleProductChart />
            </div>

            <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <RecentOrders />
                <Withdraw withdraws={withdraws} />
            </div>
        </main>
    )
}

export default Dashboard