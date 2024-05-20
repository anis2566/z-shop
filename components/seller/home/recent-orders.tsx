import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Orders } from "@/components/dashboard/home/orders"

export const RecentOrders = () => {
    return (
        <Card className="w-[300px] sm:w-full lg:col-span-2">
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                    Recent orders from your store.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Orders />
            </CardContent>
        </Card>
    )
}