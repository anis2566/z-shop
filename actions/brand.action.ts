"use server"

import { db } from "@/lib/db";
import { BrandSchema, BrandSchemaType, EditBrandSchema, EditBrandSchemaType } from "@/schema/brand";
import { revalidatePath } from "next/cache";

export const CREATE_BRAND = async (values: BrandSchemaType) => {
    const parseBody = BrandSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const brand = await db.brand.findFirst({
        where: {
            name:values.name
        }
    })

    if(brand) {
        throw new Error("Brand exists")
    }

    await db.brand.create({
        data: {
            name: values.name,
            imageUrl: values.imageUrl,
        }
    })

    revalidatePath("/dashboard/brand")

    return {
        success: "Brand created"
    }
}



export const EDIT_BRAND = async (values: EditBrandSchemaType) => {
    const parseBody = EditBrandSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const brand = await db.brand.findUnique({
        where: {
            id: values.brandId
        }
    })

    if (!brand) {
        throw new Error("Brand not found")
    }

    await db.brand.update({
        where: {
            id: values.brandId
        },
        data: {
            name: values.name,
            imageUrl: values.imageUrl,
        }
    })

    revalidatePath(`/dashboard/brand/${values.brandId}`)

    return {
        success: "Brand updated"
    }
}

export const DELETE_BRAND = async (brandId: string) => {
    const brand = await db.brand.findUnique({
        where: {
            id: brandId
        }
    })

    if (!brand) {
        throw new Error("Brand not found")
    }

    await db.brand.delete({
        where: {
            id: brandId
        }
    })

    revalidatePath("/dashboard/brand")

    return {
        success: "Brand deleted"
    }
}


export const GET_BRANDS = async () => {
    const brands = await db.brand.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return {
        brands
    }
}