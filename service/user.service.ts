"use server"

import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db"

export const getUser = async () => {
    const { userId } = auth()
    
    if (!userId) {
        throw new Error("User not found")
    }
    
    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    return {user, userId:user.id, clerkId:userId}
}