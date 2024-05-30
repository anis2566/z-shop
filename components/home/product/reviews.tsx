"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Rating } from '@smastrom/react-rating'
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"
import { useState } from "react"

import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import '@smastrom/react-rating/style.css'
import { ReviewSchema } from "@/schema/review"
import { CREATE_REVIEW, GET_PRODUCT_REVIEWS } from "@/actions/review.action"
import { ProductWithFeature } from "@/@types"
import { ReviewPagination } from "./review-pagination"

interface Props {
    productId: string;
    product: ProductWithFeature
}

export const Reviews = ({ productId, product }: Props) => {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useQuery({
        queryKey: ["product-reviews", productId, page],
        queryFn: async () => {
            const res = await GET_PRODUCT_REVIEWS({ id: productId, page })
            return res
        },
    })

    console.log(data)

    const form = useForm<z.infer<typeof ReviewSchema>>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: 0,
            content: "",
            productId

        },
    })

    const { mutate: createReview, isPending } = useMutation({
        mutationFn: CREATE_REVIEW,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-review"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-review"
            });
        }
    })

    function onSubmit(values: z.infer<typeof ReviewSchema>) {
        toast.loading("Review submitting...", {
            id: "create-review"
        })
        createReview(values)
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
                                        <Rating isDisabled={isPending} style={{ maxWidth: 140 }} value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your thought</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Leave your thought...."
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SignedIn>
                            <Button type="submit" disabled={isPending}>Submit</Button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" >
                                <Button type="button">Login to Submit</Button>
                            </SignInButton>
                        </SignedOut>
                    </form>
                </Form>
                <div className="w-full grid gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-xl font-bold">Total Reviews ({data?.totalReviews})</h1>
                        <h1 className="text-md font-bold">Rating ({product.averageRating})</h1>
                    </div>
                    {
                        isFetching ?
                            Array.from({ length: 3 }, (_, index) => (
                                <ReviewSkeleton key={index} />
                            ))
                            :
                            data?.reviews?.map(review => (
                                <div className="grid gap-6" key={review.id}>
                                    <div className="grid gap-4">
                                        <div className="flex gap-4 items-start">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarImage alt="@shadcn" src={review.user.imageUrl} />
                                                <AvatarFallback>{review.user.name}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-4">
                                                <div className="flex gap-4 items-start">
                                                    <div className="grid gap-0.5 text-sm">
                                                        <h3 className="font-semibold">{review.user.name}</h3>
                                                        <time className="text-sm text-gray-500 dark:text-gray-400">{format(review.createdAt, "dd MMMM yyyy")}</time>
                                                    </div>
                                                    <div className="flex items-center gap-0.5 self-end">
                                                        <Rating readOnly style={{ maxWidth: 100 }} value={review.rating} />
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    <p>
                                                        {review.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator />
                                    </div>
                                </div>
                            ))
                    }
                    {
                        data?.totalReviews && (
                            <ReviewPagination totalPage={data.totalReviews / 2} currentPage={page} setCurrentPage={setPage} />
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}


const ReviewSkeleton = () => {
    return (
        <div className="flex gap-x-6">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
                <div className="flex items-center gap-x-r">
                    <div className="space-y-2">
                        <Skeleton className="w-[130px] h-5" />
                        <Skeleton className="w-[100px] h-5" />
                    </div>
                    <Skeleton className="self-end w-[100px] h-5" />
                </div>
                <Skeleton className="w-[150px] h-10" />
            </div>
        </div>
    )
}