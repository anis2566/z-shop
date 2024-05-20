"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Seller } from "@prisma/client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { EDIT_IMAGE } from "@/actions/seller.action";
import { EditSellerImageSchema } from "@/schema/seller";
import Image from "next/image";
import { Trash } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface Props {
    seller: Seller
}

export const ImageForm = ({ seller }: Props) => {

    const form = useForm<z.infer<typeof EditSellerImageSchema>>({
        resolver: zodResolver(EditSellerImageSchema),
        defaultValues: {
            sellerId: seller.id || "",
            imageUrl: seller.imageUrl || "",
        },
    })

    const {mutate: updateSellerPayment, isPending} = useMutation({
        mutationFn: EDIT_IMAGE,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "update-image"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-image"
            });
        }
    })

    function onSubmit(values: z.infer<typeof EditSellerImageSchema>) {
        toast.loading("Profile image updating...", {
            id: "update-image"
        })
        updateSellerPayment(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {
                                            form.getValues("imageUrl") ? (
                                                <div className="relative mt-2">
                                                    <Image
                                                    alt="Upload"
                                                    width={120}
                                                    height={120}
                                                    className="object-contain rounded-md mx-auto"
                                                    src={form.getValues("imageUrl")}
                                                    />
                                                    <Button type="button" className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("imageUrl", "")} disabled={isPending}>
                                                        <Trash className="text-rose-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadDropzone
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        field.onChange(res[0].url)
                                                        toast.success("Image uploaded")
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("Image upload failed")
                                                    }}
                                                />                                           
                                            )
                                        }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending || form.getValues("imageUrl") === ""}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}