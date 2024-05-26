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
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <SignInButton mode="modal">
                                    <Button type="button">Login to Submit</Button>
                                </SignInButton>
                            </SignedOut>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
