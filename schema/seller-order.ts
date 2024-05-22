import { z } from "zod"

export const ProductSchema = z.object({
    productId: z.string().min(1, {
        message: "required"
    }),
    quantity: z.number().min(1, {
        message: "required"
    }),
    price: z.number().min(1, {
        message: "required"
    }),
    size: z.string().optional(),
    color: z.string().optional(),
})

export type ProductSchemaType = z.infer<typeof ProductSchema>

export const SellerOrderSchema = z.object({ 
    products: z.array(ProductSchema),
    customerName: z.string().min(3, {
        message: "required"
    }),
    address: z.string().min(5, {
        message: "required"
    }),
    mobile: z.string().min(11, {
        message: "required"
    }),
    deliveryFee: z.number().min(1, {
        message: "required"
    }),
})

export type SellerOrderSchemaType = z.infer<typeof SellerOrderSchema>