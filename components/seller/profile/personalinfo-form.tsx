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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { EDIT_PERSONAL_INFO } from "@/actions/seller.action";
import { EditSellerInfoSchema } from "@/schema/seller";

interface Props {
    seller: Seller
}

export const PersonalInfoForm = ({ seller }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const form = useForm<z.infer<typeof EditSellerInfoSchema>>({
        resolver: zodResolver(EditSellerInfoSchema),
        defaultValues: {
            sellerId: seller.id || "",
            name: seller.name || "",
            email: seller.email || "",
            imageUrl: seller.imageUrl || "",
            phone: seller.phone || "",
            address: seller.address || "",
        },
    })

    const {mutate: updateSellerInfo, isPending} = useMutation({
        mutationFn: EDIT_PERSONAL_INFO,
        onSuccess: (data) => {
            setIsEdit(false)
            toast.success(data.success, {
                id: "update-info"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-info"
            });
        }
    })

    function onSubmit(values: z.infer<typeof EditSellerInfoSchema>) {
        toast.loading("Information updating...", {
            id: "update-info"
        })
        updateSellerInfo(values)
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} type="text" disabled={isPending || !isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} type="text" disabled={isPending || !isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your phone" {...field} type="text" disabled={isPending || !isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter full address"
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending || !isEdit}
                                        />
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