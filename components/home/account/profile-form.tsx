"use client"

import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

import { UploadDropzone } from "@/lib/uploadthing"
import { UPDATE_PROFILE } from "@/actions/user.action"
import { UserSchema } from "@/schema/user"

interface Props {
    user: User
}

export const ProfileForm = ({ user }: Props) => {

    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user.name || "",
            imageUrl: user.imageUrl || ""
        },
    })

    const {mutate: updateProfile, isPending} = useMutation({
        mutationFn: UPDATE_PROFILE,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["get-user"],
                
            })
            queryClient.refetchQueries({ queryKey: ["get-user"] });
            toast.success(data.success, {
                id: "update-profile"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-profile"
            });
        }
    })

    function onSubmit(values: z.infer<typeof UserSchema>) {
        toast.loading("Profile updating...", {
            id: "update-profile"
        })
        updateProfile(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Customize your profile</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                                    <Button className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("imageUrl", "")} disabled={isPending}>
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
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}