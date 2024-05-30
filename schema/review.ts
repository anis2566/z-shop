import { z } from "zod"

export const ReviewSchema = z.object({
    productId: z.string().min(1, {
        message: "required"
    }),
    rating: z.number().min(1, {
        message: "required"
    }),
    content: z.string().min(10, {
        message: "too short"
    })
})

export type ReviewSchemaType = z.infer<typeof ReviewSchema>
