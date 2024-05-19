"use client"

import { PlusCircle, Trash2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "../ui/separator"

import { Input } from "@/components/ui/input"
import { StockVariantSchema } from "@/schema/stock"
import { CREATE_STOCK } from "@/actions/stock.action"
import { useEffect } from "react"

interface Props {
    open: boolean;
    onClose: () => void;
    productId: string;
}

export const AddVariantModal = ({ open, onClose, productId }: Props) => {

    const router = useRouter()

    const form = useForm<z.infer<typeof StockVariantSchema>>({
        resolver: zodResolver(StockVariantSchema),
        defaultValues: {
            productId: productId || "",
            stocks: [
                {
                    size: "",
                    stock: 0,
            }
        ]
        },
    })

    useEffect(() => {
        form.setValue("productId", productId)
    },[])
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "stocks"
    });

    const handleAddVariant = () => {
        append({
            size: "",
            stock: 0
        })
    }

    const {mutate: createStock, isPending} = useMutation({
        mutationFn: CREATE_STOCK,
        onSuccess: (data) => {
            onClose()
            router.push("/dashboard/products")
            toast.success(data.success, {
                id: "create-stock"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-stock"
            });
        }
    })
 
    function onSubmit(values: z.infer<typeof StockVariantSchema>) {
        toast.loading("Stock creating...", {
                id: "create-stock"
        })
        createStock(values)
    }

    return (
        <Dialog open={open && productId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Stock Variant</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2 gap-x-2">
                                <div>Size</div>
                                <div>Stock</div>
                                <div>Action</div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                {
                                    fields.map((field, index) => (
                                        <div key={index} className="flex justify-between gap-x-2">
                                            <FormField
                                                control={form.control}
                                                name={`stocks.${index}.size`}
                                                render={({ field, fieldState }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="text" {...field} disabled={isPending} />
                                                        </FormControl>
                                                        {
                                                            fieldState.error && (
                                                                <FormMessage>{fieldState.error.message}</FormMessage>
                                                            )
                                                        }
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`stocks.${index}.stock`}
                                                render={({ field, fieldState }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                                        </FormControl>
                                                        {
                                                            fieldState.error && (
                                                                <FormMessage>{fieldState.error.message}</FormMessage>
                                                            )
                                                        }
                                                    </FormItem>
                                                )}
                                            />
                                            <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => remove(index)} disabled={fields.length === 1 || isPending}>
                                                <Trash2 className="w-5 h-5 text-rose-500" />
                                            </Button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button variant="outline" type='button' className="gap-x-2" onClick={handleAddVariant} disabled={isPending}>
                                <PlusCircle className="w-5 h-5" />
                                Add More
                            </Button>
                            <Button type='submit' disabled={isPending}>Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}