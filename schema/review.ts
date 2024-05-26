import { z } from "zod"

export const ReviewSchema = z.object({
    rating: z.number().min(1, {
        message: "required"
    }),
    review: z.string().min(1, {
        message: "required"
    })
})

export type ReviewSchemaType = z.infer<typeof ReviewSchema>
