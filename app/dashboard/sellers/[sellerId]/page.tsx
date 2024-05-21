import Image from "next/image"
import { redirect } from "next/navigation"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"

import { db } from "@/lib/db"

interface Props {
    params: {
        sellerId: string;
    }
}

const SellerDetails = async ({params}:Props) => {
    
    const seller = await db.seller.findUnique({
        where: {
            id: params.sellerId
        }
    })

    if (!seller) redirect("/dashboard")
    
    return (
        <div className="w-full space-y-8">
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
                    <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                    <Image
                        alt="Avatar"
                        className="rounded-full"
                        height="100"
                        src={seller.imageUrl}
                        style={{
                            aspectRatio: "100/100",
                            objectFit: "cover",
                            }}
                        width="100"
                    />
                    <div className="grid gap-1 text-sm md:gap-2">
                        <div className="font-semibold text-xl">Hello, <span className="text-primary">{seller.name}</span></div>
                        <div>{seller.email}</div>
                        <div>{seller.phone}</div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">faf</div>
                <div>faf</div>
            </div>
        </div>
    )
}

export default SellerDetails