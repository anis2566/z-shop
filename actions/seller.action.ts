"use server"

import { db } from "@/lib/db"
import { EditProductSchema, EditProductSchemaType } from "@/schema/product"
import { EditSellerImageSchema, EditSellerImageSchemaType, EditSellerInfoSchema, EditSellerInfoSchemaType, EditSellerPaymentSchema, EditSellerPaymentSchemaType, SellerSchema, SellerSchemaType, UpdateSellerStatusSchema, UpdateSellerStatusSchemaType } from "@/schema/seller"
import { getUser } from "@/service/user.service"
import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

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

    await db.user.update({
        where: {
            clerkId
        },
        data: {
            role: "seller",
        }
    })

    return {
        success: "Account created"
    }
}

type UpdateSeller = {
    sellerId: string;
    values: SellerSchemaType
}

export const UPDATE_SELLER = async ({sellerId, values}:UpdateSeller) => {
    const parseBody = SellerSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const seller = await db.seller.findUnique({
        where: {
            id: sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    await db.seller.update({
        where: {
            id: sellerId
        },
        data: {
            ...values
        }
    })

    revalidatePath(`/dashboard/sellers/edit/${sellerId}`)

    return {
        success: "Seller updated"
    }

}

export const EDIT_PERSONAL_INFO = async (values: EditSellerInfoSchemaType) => {
    const parseBody = EditSellerInfoSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const seller = await db.seller.findUnique({
        where: {
            id: values.sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    const {sellerId, ...rest} = values

    await db.seller.update({
        where: {
            id: values.sellerId
        },
        data: {
            ...rest
        }
    })

    revalidatePath("/seller/profile")

    return {
        success: "Information updated"
    }
}


export const EDIT_PAYMENT_INFO = async (values: EditSellerPaymentSchemaType) => {
    const parseBody = EditSellerPaymentSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const seller = await db.seller.findUnique({
        where: {
            id: values.sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    const {sellerId, ...rest} = values

    await db.seller.update({
        where: {
            id: values.sellerId
        },
        data: {
            ...rest
        }
    })

    revalidatePath("/seller/profile")

    return {
        success: "Information updated"
    }
}


export const EDIT_IMAGE = async (values: EditSellerImageSchemaType) => {
    const parseBody = EditSellerImageSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const seller = await db.seller.findUnique({
        where: {
            id: values.sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    const {sellerId, ...rest} = values

    await db.seller.update({
        where: {
            id: values.sellerId
        },
        data: {
            ...rest
        }
    })

    revalidatePath("/seller/profile")

    return {
        success: "Profile image updated"
    }
}



export const UPDATE_SELLER_STATUS = async (values: UpdateSellerStatusSchemaType) => {
    const parseBody = UpdateSellerStatusSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const seller = await db.seller.findUnique({
        where: {
            id: values.sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    await db.seller.update({
        where: {
            id: values.sellerId
        },
        data: {
            status: values.status
        }
    })

    revalidatePath("/dashboard/seller/request")

    return {
        success: "Status updated"
    }
}


export const DELETE_SELLER = async (sellerId: string) => {
    const seller = await db.seller.findUnique({
        where: {
            id: sellerId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    await db.seller.delete({
        where: {
            id: sellerId
        }
    })

    revalidatePath("/dashboard/sellers")

    return {
        success: "Seller deleted"
    }
}