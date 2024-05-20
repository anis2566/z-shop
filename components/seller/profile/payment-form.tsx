"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Seller } from "@prisma/client";
import { Pencil, X } from "lucide-react";
import { useState } from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { EDIT_PAYMENT_INFO } from "@/actions/seller.action";
import { EditSellerPaymentSchema } from "@/schema/seller";

interface Props {
    seller: Seller
}

export const PaymentForm = ({ seller }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const form = useForm<z.infer<typeof EditSellerPaymentSchema>>({
        resolver: zodResolver(EditSellerPaymentSchema),
        defaultValues: {
            sellerId: seller.id || "",
            accountType: seller.accountType || "",
            paymentNumber: seller.paymentNumber || "",
        },
    })

    const {mutate: updateSellerPayment, isPending} = useMutation({
        mutationFn: EDIT_PAYMENT_INFO,
        onSuccess: (data) => {
            setIsEdit(false)
            toast.success(data.success, {
                id: "update-payment"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-payment"
            });
        }
    })

    function onSubmit(values: z.infer<typeof EditSellerPaymentSchema>) {
        toast.loading("Payment updating...", {
            id: "update-payment"
        })
        updateSellerPayment(values)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setIsEdit(!isEdit)}>
                                {
                                    isEdit ? (
                                        <X className="text-rose-500" />
                                    ): (
                                        <Pencil className="text-amber-500" />
                                    )
                                }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {isEdit ? "Disable Edit" : "Enable Edit"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || !isEdit}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                ["bkash", "nogad", "rocket"].map((v, i) => (
                                                    <SelectItem value={v} key={i} className="capitalize">{v}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} type="text" disabled={isPending || !isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending || !isEdit}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}