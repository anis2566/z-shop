"use server"

import { db } from "@/lib/db";
import { BrandSchema, BrandSchemaType } from "@/schema/brand";
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