import { z } from "zod";

export const SellerSchema = z.object({
  name: z.string().min(1, {
    message: "required",
  }),
  email: z.string().min(1, {
    message: "required",
  }),
  imageUrl: z.string().min(1, {
    message: "required",
  }),
  phone: z.string().min(11, {
    message: "required",
  }),
  address: z.string().min(1, {
    message: "required",
  }),
  paymentNumber: z.string().min(11, {
    message: "required",
  }),
  accountType: z.string().min(1, {
    message: "required",
  }),
});

export type SellerSchemaType = z.infer<typeof SellerSchema>;
