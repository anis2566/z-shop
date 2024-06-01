"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { getUser } from "@/service/user.service"
import { ProfileForm } from "@/components/home/account/profile-form"

const Profile = () => {
    
    const { data: user, isFetching } = useQuery({
        queryKey: ["get-user"],
        queryFn: async () => {
            const res = await getUser()
            return res.user
        },
        staleTime: 60 * 60 * 1000,
        retry: 3,
        retryDelay: 1000,
    })

    return (
        <div className="flex-1 space-y-8">
            {isFetching ? (
                <AccountSkeleton />
            ) : user ? (
                <Card className="w-full">
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="60"
                            src={user?.imageUrl || ""}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="60"
                        />
                        <div className="grid gap-1 text-sm md:gap-2">
                            <div className="font-semibold text-xl">{`${user.name?.split(" ")[0]}`} <span className="text-primary">{user.name?.split(" ")[1]}</span></div>
                            <div>{user.email}</div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

            {
                user &&
                <ProfileForm user={user} />
            }
        </div>
    )
}

export default Profile

const AccountSkeleton = () => {
    return (
        <Card className="w-full">
            <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                <Skeleton className="h-[60px] w-[60px] rounded-full" />
                <div className="grid gap-1 text-sm md:gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardContent>
        </Card>
    )
}