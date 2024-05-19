"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Image from "next/image"
import { Trash } from "lucide-react"
import "react-quill/dist/quill.snow.css";
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { GET_BRANDS } from "@/actions/brand.action"
import { GET_CATEGORIES } from "@/actions/category.action"
import { VariantProductSchema } from "@/schema/product"
import {CREATE_VARIANT_PRODUCT } from "@/actions/product.action"
import { AddVariantModal } from "@/components/modal/add-variant-modal"
import queryString from "query-string"

export const CreateVariantProduct = () => {
    const [open, setOpen] = useState<boolean>(false)

    const pathname = usePathname()
    const router = useRouter()

    const productId = useSearchParams().get("productId")

    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    const {data: brands} = useQuery({
        queryKey: ["get-brands"],
        queryFn: async () => {
            const res = await GET_BRANDS()
            return res.brands
        }
    })

    const {data: categories} = useQuery({
        queryKey: ["get-categories"],
        queryFn: async () => {
            const res = await GET_CATEGORIES()
            return res.categories
        }
    })

    const onClose = () => {
        setOpen(false)
    }

    const form = useForm<z.infer<typeof VariantProductSchema>>({
        resolver: zodResolver(VariantProductSchema),
        defaultValues: {
            name: "",
            description: "",
            brandId: "",
            categoryId: "",
            price: undefined,
            discountPrice: undefined,
            sellerPrice: undefined,
            featureImageUrl: "",
            images: [],
            colors: [],
            status: "DRAFT"
        },
    })

    const {mutate: createProduct, isPending} = useMutation({
        mutationFn: CREATE_VARIANT_PRODUCT,
        onSuccess: (data) => {
            const url = queryString.stringifyUrl({
                url: pathname,
                query: {
                    productId: data.productId
                }
            }, { skipEmptyString: true, skipNull: true })
            
            router.push(url)
            
            setOpen(true)
            toast.success(data.success, {
                id: "create-product"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-product"
            });
        }
    })

    

    const onSubmit = async (values: z.infer<typeof VariantProductSchema>) => {
        toast.loading("Product creating...", {
            id: "create-product"
        })
        createProduct(values)
    }

    return (
        <div className="w-full space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ">
                        <Card>
                            <CardHeader>
                                <CardTitle>Identity</CardTitle>
                                <CardDescription>
                                    Provide product indentity with name, description and brand
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    disabled={isPending}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter product name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    disabled={isPending}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <ReactQuill
                                                    theme="snow"
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    disabled={isPending}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand Name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a brand" />
                                                </SelectTrigger>
                                                </FormControl>
                                                    <SelectContent>
                                                        {
                                                            brands && brands.map((brand) => (
                                                                <SelectItem value={brand.id} key={brand.id}>{brand.name}</SelectItem>
                                                            ))
                                                        }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />                               
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Provide product feature images</CardDescription>
                                <CardContent className="p-0">
                                    <FormField
                                        control={form.control}
                                        name="featureImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Feature Image</FormLabel>
                                                <FormControl>
                                                    {
                                                        form.getValues("featureImageUrl") ? (
                                                            <div className="relative mt-2">
                                                                <Image
                                                                alt="Upload"
                                                                width={120}
                                                                height={120}
                                                                className="object-contain rounded-md mx-auto"
                                                                src={form.getValues("featureImageUrl")}
                                                                />
                                                                <Button className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("featureImageUrl", "")} disabled={isPending}>
                                                                    <Trash className="text-rose-500" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <UploadDropzone
                                                                endpoint="imageUploader"
                                                                onClientUploadComplete={(res) => {
                                                                    // Do something with the response
                                                                    field.onChange(res[0].url)
                                                                    // toggleEdit()
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
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Provide product images</CardDescription>
                                <CardContent className="p-0">
                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Images</FormLabel>
                                                <FormControl>
                                                    {
                                                        (form.getValues("images")?.length ?? 0) > 0 ? (
                                                            <div className="flex gap-x-4 justify-start flex-wrap">
                                                                {
                                                                    form.getValues("images")?.map((img, index) => (
                                                                        <div key={index} className="relative">
                                                                            <Image
                                                                                alt="Upload"
                                                                                width={120}
                                                                                height={120}
                                                                                className="object-contain rounded-md mx-auto"
                                                                                src={img}
                                                                            />
                                                                            <Button className="absolute -top-5 -right-5" variant="ghost" size="icon" onClick={() => {
                                                                                const images = form.getValues("images")
                                                                                form.setValue("images", images?.filter(image => image !== img))
                                                                            }} disabled={isPending}>
                                                                                <Trash className="text-rose-500" />
                                                                            </Button>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        ) : (
                                                            <UploadDropzone
                                                                endpoint="productImageUploader"
                                                                onClientUploadComplete={(res) => {
                                                                    // Do something with the response
                                                                    console.log(res)
                                                                    res.map(img => {
                                                                        if (res.length > 0) {
                                                                            const currentImages = form.getValues("images") || [];
                                                                            form.setValue("images", [...currentImages, img.url]);
                                                                        }
                                                                    })
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
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="space-y-6">
                       <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                                <CardDescription>Provide product category</CardDescription>
                                <CardContent className="p-0">
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                </FormControl>
                                                    <SelectContent>
                                                        {
                                                            categories && categories.map((category) => (

                                                                <SelectItem value={category.id} key={category.id}>{category.name}</SelectItem>
                                                            ))
                                                        }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                                <CardDescription>Provide product price</CardDescription>
                                <CardContent className="p-0 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="discountPrice"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Discount price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter discount price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sellerPrice"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Seller price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter seller price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Colors</CardTitle>
                                <CardDescription>Provide product colors</CardDescription>
                                <CardContent className="p-0 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="colors"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Colors</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter tags" {...field}
                                                    onChange={(e) => {
                                                    const colorArray = e.target.value.split(",").map(color => color.trim());
                                                    field.onChange(colorArray);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Use comma after each color name or hex code
                                            </FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                                <CardDescription>Provide product status</CardDescription>
                                <CardContent className="p-0">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        disabled={isPending}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                </FormControl>
                                                    <SelectContent>
                                                        {
                                                            ["DRAFT", "ACTIVE"].map((item, index) => (

                                                                <SelectItem value={item} key={index}>{item}</SelectItem>
                                                            ))
                                                        }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <Button type="submit" disabled={isPending}>
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>

            <AddVariantModal open={open} onClose={onClose} productId={productId ?? ""} />
        </div>
    )
}