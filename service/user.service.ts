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


export const getSeller = async () => {
    const { userId } = await getUser()
    
    const seller = await db.seller.findUnique({
        where: {
            userId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    return {sellerId: seller.id}
}