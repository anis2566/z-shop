"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SellerSchema } from "@/schema/seller";
import { CREATE_SELLER } from "@/actions/seller.action";

export default function SellerRegister() {

    const form = useForm<z.infer<typeof SellerSchema>>({
        resolver: zodResolver(SellerSchema),
        defaultValues: {
            name: "",
            email: "",
            imageUrl: "",
            phone: "",
            address: "",
            paymentNumber: "",
            accountType: ""
        },
    })

    const {mutate: createSeller, isPending} = useMutation({
        mutationFn: CREATE_SELLER,
        onSuccess: (data) => {
            // router.push("/dashboard/category")
            toast.success(data.success, {
                id: "create-seller"
            });
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.message, {
                id: "create-seller"
            });
        }
    })

    function onSubmit(values: z.infer<typeof SellerSchema>) {
        toast.loading("Account creating...", {
            id: "create-seller"
        })
        createSeller(values)
    }

    return (
        <div className="space-y-6 w-full pt-5 px-4 h-screen">
            <div className="w-full flex justify-center">
                <div className="w-[100px] h-[100px] rounded-full shadow-md shadow-primary flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={70}
                        width={70}
                    />
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary text-center">Become a Seller</h1>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    Join our marketplace and start selling your products today.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} type="text" disabled={isPending} />
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
                                                <Input placeholder="Enter your email" {...field} type="text" disabled={isPending} />
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
                                                <Input placeholder="Enter your phone" {...field} type="text" disabled={isPending} />
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
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Media </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <Card className="min-h-[250px]">
                            <CardHeader>
                                <CardTitle>Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="accountType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                                                <Input placeholder="Enter your name" {...field} type="text" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}