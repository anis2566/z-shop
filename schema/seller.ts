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


export const EditSellerInfoSchema = z.object({
  sellerId: z.string().min(1, {
    message: "required",
  }),
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
});

export type EditSellerInfoSchemaType = z.infer<typeof EditSellerInfoSchema>;


export const EditSellerPaymentSchema = z.object({
  sellerId: z.string().min(1, {
    message: "required",
  }),
  paymentNumber: z.string().min(11, {
    message: "required",
  }),
  accountType: z.string().min(1, {
    message: "required",
  }),
});

export type EditSellerPaymentSchemaType = z.infer<typeof EditSellerPaymentSchema>;


export const EditSellerImageSchema = z.object({
  sellerId: z.string().min(1, {
    message: "required",
  }),
  imageUrl: z.string().min(1, {
    message: "required",
  }),
});

export type EditSellerImageSchemaType = z.infer<typeof EditSellerImageSchema>;


export const UpdateSellerStatusSchema = z.object({
  sellerId: z.string().min(1, {
    message: "required"
  }),
  status: z.enum(["active", "inactive"], {
    message: "required",
  }),
});

export type UpdateSellerStatusSchemaType = z.infer<typeof UpdateSellerStatusSchema>;



