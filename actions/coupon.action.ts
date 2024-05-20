"use server"

import { db } from "@/lib/db"
import { CouponSchema, CouponSchemaType, EditCouponSchema, EditCouponSchemaType } from "@/schema/coupon"
import { revalidatePath } from "next/cache"

export const CREATE_COUPON = async (values: CouponSchemaType) => {
    const parseBody = CouponSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input field")
    }

    const coupon = await db.coupon.findFirst({
        where: {
            OR: [
                {name: values.name},
                {code: values.code}
            ]
        }
    })

    if (coupon) {
        throw new Error("Coupon exists")
    }

    await db.coupon.create({
        data: {
            ...values
        }
    })

    revalidatePath("/dashboard/coupon")

    return {
        success: "Coupon created"
    }
}


export const UPDATE_COUPON = async (values: EditCouponSchemaType) => {
    const parseBody = EditCouponSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input field")
    }

    const coupon = await db.coupon.findUnique({
        where: { id: values.couponId }
    })

    if (!coupon) {
       throw new Error("Coupon not found")
    }

    const { couponId, ...rest } = values
    
    await db.coupon.update({
        where: {
            id: couponId
        },
        data: {
            ...rest
        }
    })

    revalidatePath(`/dashboard/coupon/${couponId}`)

    return {
        success: "Coupon updated"
    }
}


export const DELETE_COUPON = async (couponId: string) => {
    const coupon = await db.coupon.findUnique({
        where: { id: couponId }
    })

    if (!coupon) {
        throw new Error("Coupon not found")
    }

    await db.coupon.delete({
        where: { id: couponId }
    })

    revalidatePath("/dashboard/coupon")

    return {
        success: "Coupon deleted"
    }
}