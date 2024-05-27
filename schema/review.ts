import { z } from "zod"

export const ReviewSchema = z.object({
    rating: z.number().min(1, {
        message: "required"
    }),
    review: z.string().min(10, {
        message: "too short"
    })
})

export type ReviewSchemaType = z.infer<typeof ReviewSchema>
