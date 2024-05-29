"use client"

import { useState } from "react";
import { OrderProduct } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { UPDATE_ORDER } from "@/actions/order.action";

interface Props {
    id: string;
    products: OrderProduct[]
}

export const StatusCard = ({ id, products }: Props) => {
    const [status, setStatus] = useState<string>("")

    const { mutate: updateOrder, isPending } = useMutation({
        mutationFn: UPDATE_ORDER,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "update-order",
                duration: 2000
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-order",
                duration: 2000
            })
        },
    })

    const handleUpdate = () => {
        toast.loading("Status updating...", { id: "update-order" });
        updateOrder({
            orderId: id,
            products,
            status
        })
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-4">
                <CardTitle>Status</CardTitle>
                <CardDescription>Update order status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select defaultValue={status} onValueChange={value => setStatus(value)} disabled={isPending}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            ["shipping", "delivered", "returned"].map((value, i) => (
                                <SelectItem value={value} key={i} className="capitalize">{value}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Button className="w-full" onClick={handleUpdate} disabled={!status || isPending}>Update</Button>
            </CardContent>
        </Card>
    )
}