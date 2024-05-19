import { z } from "zod"

export const BrandSchema = z.object({
    name: z.string().min(1, {
        message: "required",
    }),
    imageUrl: z.string().min(1, {
    message: "required",
    }),
})

export type BrandSchemaType = z.infer<typeof BrandSchema>

export const EditBrandSchema = z.object({
    brandId: z.string().min(1, {
        message: "required",
    }),
    name: z.string().min(1, {
        message: "required",
    }),
    imageUrl: z.string().min(1, {
        message: "required",
    }),
})

export type EditBrandSchemaType = z.infer<typeof EditBrandSchema>