"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Category, Product, Stock, Brand } from "@prisma/client"
import Image from "next/image"
import { UploadDropzone } from "@/lib/uploadthing"
import { Trash,PlusCircle,RotateCw } from "lucide-react"

import "react-quill/dist/quill.snow.css";

import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET_BRANDS } from "@/actions/brand.action";
import { GET_CATEGORIES } from "@/actions/category.action";
import { EditProductSchema } from "@/schema/product";
import { EDIT_PRODUCT } from "@/actions/product.action";

interface ProductWithStock extends Product {
    stocks?: Stock[]
}

interface Props {
    product: ProductWithStock
}
export const EditProduct = ({product}:Props) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
    const [open, setOpen] = useState<boolean>(false)

    const onClose = () => {
        setOpen(false)
    }

    const stocks = product.stocks?.map((item, i) => ({ size: item.size, stock: item.stock, id: i }))

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
   
    const form = useForm<z.infer<typeof EditProductSchema>>({
        resolver: zodResolver(EditProductSchema),
        defaultValues: {
            productId: product.id || "",
            name: product.name || "",
            description: product.description || "",
            brandId: product.brandId || "",
            categoryId: product.categoryId || "",
            price: product.price || undefined,
            discountPrice: product.discountPrice || undefined,
            sellerPrice: product.sellerPrice || undefined,
            totalStock: product.totalStock || undefined,
            featureImageUrl: product.featureImageUrl || "",
            images: product.images || [],
            colors: product.colors || [],
            status: product.status || "DRAFT"
        },
    })

    const {mutate: updateProduct, isPending} = useMutation({
        mutationFn: EDIT_PRODUCT,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "update-product"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-product"
            });
        }
    })

    const onSubmit = async (values: z.infer<typeof EditProductSchema>) => {
        toast.loading("Product updating...", {
            id: "update-product"
        })
        updateProduct(values)
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
                                    Provide product indentity with name and description
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter product name..." {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <ReactQuill
                                                    theme="snow"
                                                    onChange={field.onChange}
                                                    value={form.getValues("description")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand Name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="discountPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Discount price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter discount price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sellerPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Seller price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter seller price..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        {
                            (product.stocks?.length ?? 0) > 0 &&  (
                                <Button type="button" onClick={() => setOpen(true)}>Edit Variant</Button>
                            )
                        }
                        {
                            (product.stocks?.length ?? 0) < 1 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Stock</CardTitle>
                                        <CardDescription>Provide product stock</CardDescription>
                                        <CardContent className="p-0 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="totalStock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Stock</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter product stock..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            )
                        }
                        <Card>
                            <CardHeader>
                                <CardTitle>Colors</CardTitle>
                                <CardDescription>Provide product colors</CardDescription>
                                <CardContent className="p-0 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="colors"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Colors</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter tags" {...field}
                                                    onChange={(e) => {
                                                    const colorArray = e.target.value.split(",").map(color => color.trim());
                                                    field.onChange(colorArray);
                                                    }}
                                                    disabled={isPending}
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
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                        <Button type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}