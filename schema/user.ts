import { z } from "zod"

export const UserSchema = z.object({
  name: z.string().min(4, {
    message: "required",
  }),
  imageUrl: z.string().min(4, {
    message: "required",
  }),
});

export type UserSchemaType = z.infer<typeof UserSchema>