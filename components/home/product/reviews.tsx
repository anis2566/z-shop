"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { StarIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import { ReviewSchema } from "@/schema/review"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"



export const Reviews = () => {
    const form = useForm<z.infer<typeof ReviewSchema>>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: 0,
            review: ""
        },
    })

    function onSubmit(values: z.infer<typeof ReviewSchema>) {
        console.log(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Rating style={{ maxWidth: 140 }} value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="review"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Leave your thought...."
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SignedIn>
                            <Button type="submit">Submit</Button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" >
                                <Button type="button">Login to Submit</Button>
                            </SignInButton>
                        </SignedOut>
                    </form>
                </Form>
                <div className="px-4 md:px-6 mx-auto max-w-6xl grid gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-xl font-bold">Total Reviews (32)</h1>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-4">
                            <div className="flex gap-4 items-start">
                                <Avatar className="w-10 h-10 border">
                                <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                                <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="grid gap-0.5 text-sm">
                                    <h3 className="font-semibold">Sarah Johnson</h3>
                                    <time className="text-sm text-gray-500 dark:text-gray-400">2 days ago</time>
                                    </div>
                                    <div className="flex items-center gap-0.5 ml-auto">
                                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <StarIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <StarIcon className="w-4 h-4 fill-muted stroke-muted-foreground" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <p>
                                    I have been experimenting with my LuminaCook Multi-Function Air Fryer for a few weeks now, and it is been
                                    a versatile addition to my kitchen. It is great for making crispy fries, chicken wings, and even some
                                    healthier options.
                                    </p>
                                </div>
                                </div>
                            </div>
                            <Separator />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
