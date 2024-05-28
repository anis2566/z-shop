"use client"

import { AddressShema } from "@/schema/address"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { CREATE_ADDRESS } from "@/actions/address.action"

type Division = {
    id: string;
    name: string;
}

export const AddressForm = () => {
    const [divisions, setDivisions] = useState<Division[]>([])

    useEffect(() => {
        const fetchDivisions = async () => {
            const res = await fetch("https://bdapi.vercel.app/api/v.1/division");
            if (res.ok) {
                const data = await res.json();
                setDivisions(data?.data || []);
            } else {
                console.error("Failed to fetch divisions:", res.status);
            }
        };
        fetchDivisions();
    }, []);

    const form = useForm<z.infer<typeof AddressShema>>({
        resolver: zodResolver(AddressShema),
        defaultValues: {
            title: "",
            recepient: "",
            division: "",
            address: "",
            phone: ""
        },
    })

    const {mutate: createAddress, isPending} = useMutation({
        mutationFn: CREATE_ADDRESS,
        onSuccess: (data) => {
            form.reset()
            toast.success(data?.success, {
                id: "create-address"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-address"
            });
        }
    })

    function onSubmit(values: z.infer<typeof AddressShema>) {
        toast.loading("Address saving...", {
            id: "create-address"
        })
        createAddress(values)
    }
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>New Address</CardTitle>
                <CardDescription>Create new address to save your time in order process.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address title" type="text" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="recepient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recepient Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter recepient name" type="text" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="division"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Division</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select division" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                divisions && divisions.map((division) => (
                                                    <SelectItem value={division.name} key={division.id}>{division.name}</SelectItem>
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Full address"
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending}
                                        />
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
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact number" type="text" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Save</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

