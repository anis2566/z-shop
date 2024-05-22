"use client"

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SellerOrderProduct } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { UPDATE_SELLER_ORDER_STATUS, UPDATE_TRACKING_ID } from "@/actions/seller-order";

interface Props {
    orderId: string;
    products: SellerOrderProduct[]
}

export const StatusCard = ({orderId, products}:Props) => {
    const [status, setStatus] = useState<string>("")
    const [trackingId, setTrackingId] = useState<string>("")

    const router = useRouter()
    const pathname = usePathname()
    const open = useSearchParams().get("open")

    const {mutate: updateOrder, isPending} = useMutation({
        mutationFn: UPDATE_SELLER_ORDER_STATUS,
        onSuccess: (data) => {
            if (data?.status === "shipping") {
                const url = queryString.stringifyUrl({
                    url: pathname,
                    query: {
                        open: "true",
                    }
                }, { skipEmptyString: true, skipNull: true })
                
                router.push(url)
            }
            toast.success(data?.success, {
                id: "update-status"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-status"
            });
        }
    })

    const {mutate: addTracking, isPending:loading} = useMutation({
        mutationFn: UPDATE_TRACKING_ID,
        onSuccess: (data) => {
            router.push(pathname)
            toast.success(data?.success, {
                id: "add-tracking"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-tracking"
            });
        }
    })

    const handleUpdate = () => {
        toast.loading("Status updating...", {
            id: "update-status"
        })
        updateOrder({
            orderId,
            products,
            status
        })
    }

    const handleAddTracking = () => {
        toast.loading("Tracking Id adding...", {
            id: "add-tracking"
        })
        addTracking({
            orderId,
            trackingId
        })
    }


    return (
        <div>
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
                    <Button className="w-full" onClick={handleUpdate} disabled={isPending}>Update</Button>
                </CardContent>
            </Card>
            <Dialog open={!!open}>
                <DialogContent className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Add Tracking Id</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Enter tracking Id" onChange={(e) => setTrackingId(e.target.value)} autoFocus />
                    <Button disabled={!trackingId || loading} onClick={handleAddTracking}>Submit</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}