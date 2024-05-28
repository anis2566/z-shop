import { z } from "zod"

export const AddressShema = z.object({
  title: z.string().min(4, {
    message: "required",
  }),
  recepient: z.string().min(4, {
    message: "required",
  }),
  division: z.string().min(1, {
    message: "required",
  }),
  address: z.string().min(7, {
    message: "required",
  }),
  phone: z.string().min(11, {
    message: "required",
  }),
});

export type AddressShemaType = z.infer<typeof AddressShema>