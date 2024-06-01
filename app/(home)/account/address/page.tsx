"use client"

import { MapPin } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { AddressForm } from "@/components/home/account/address-form"
import { TrashButton } from "@/components/home/account/trash-button"
import { useQuery } from "@tanstack/react-query"
import { GET_USER_ADDRESS } from "@/actions/address.action"
import { Skeleton } from "@/components/ui/skeleton"

const Address = () => {
    
    const {data:addresses, isFetching} = useQuery({
        queryKey: ["user-address"],
        queryFn: async () => {
            const res = await GET_USER_ADDRESS()
            return res.addresses
        },
        staleTime: 60 * 60 * 1000
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
                        isFetching ?
                        Array.from({length: 3}, (_, index) => (
                            <Skeleton key={index} className="h-10 w-[130px]" />
                        )) 
                        :
                        addresses?.map((item, i) => (
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