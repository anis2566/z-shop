import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Orders } from "@/components/dashboard/home/orders"
import { SellerOrders } from "@/components/dashboard/home/seller-orders"

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
                <Tabs defaultValue="main" className="w-full">
                    <TabsList>
                        <TabsTrigger value="main">Main</TabsTrigger>
                        <TabsTrigger value="seller">Seller</TabsTrigger>
                    </TabsList>
                    <TabsContent value="main">
                        <Orders />
                    </TabsContent>
                    <TabsContent value="seller">
                        <SellerOrders />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}