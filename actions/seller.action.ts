"use server"

import { db } from "@/lib/db"
import { SellerSchema, SellerSchemaType } from "@/schema/seller"
import { getUser } from "@/service/user.service"
import { clerkClient } from "@clerk/nextjs/server"

export const CREATE_SELLER = async (values: SellerSchemaType) => {
    const parseBody = SellerSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const { userId, clerkId } = await getUser()
    
    const seller = await db.seller.findUnique({
        where: {
            userId
        }
    })

    if (seller) {
        throw new Error("Seller already exists")
    }

    const newSeller = await db.seller.create({
        data: {
            userId,
            ...values
        }
    })

    await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
            role: "seller",
            status: newSeller.status
        },
    });

    return {
        success: "Account created"
    }
}