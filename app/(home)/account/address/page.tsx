import { MapPin } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { AddressForm } from "@/components/home/account/address-form"
import { TrashButton } from "@/components/home/account/trash-button"
import { db } from "@/lib/db"

const Address = async () => {
    const address = await db.address.findMany({
        where:{
            title: {
                not: ""
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className="flex-1 space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Saved Address</CardTitle>
                    <CardDescription>Manage your saved address here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center flex-wrap md:flex-nowrap gap-x-4 gap-y-3">
                    {
                        address.map((item, i) => (
                            <div key={i} className="flex items-center gap-x-2 bg-indigo-500 px-2 rounded-md text-white">
                                <MapPin className="w-5 h-5" />
                                {item.title}
                                <TrashButton addressId={item.id} />
                            </div>
                        ))
                    }
                </CardContent>
            </Card>
            <AddressForm />
        </div>
    )
}

export default Address