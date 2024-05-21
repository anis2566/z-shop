"use server"

import { db } from "@/lib/db"
import { SellerOrderSchema, SellerOrderSchemaType } from "@/schema/seller-order"
import { getUser } from "@/service/user.service"
import { revalidatePath } from "next/cache"

export const CREATE_SELLER_ORDER = async (values: SellerOrderSchemaType) => {
    const parseBody = SellerOrderSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input field")
    }

    const { userId } = await getUser()
    
    const seller = await db.seller.findUnique({
        where: {
            userId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    const { products, customerName, address, mobile, deliveryFee } = parseBody.data

    
    
    const total = products.reduce((acc, curr) => acc + (curr.price * curr.quantity),0)

    await db.sellerOrder.create({
        data: {
            sellerId: seller.id,
            customerName,
            address,
            mobile,
            total,
            deliveryFee,
            products: {
                createMany: {
                    data: products.map(product => (
                        {
                            productId: product.productId,
                            price: product.price,
                            quantity: product.quantity,
                            size: product.size,
                            color: product.color
                        }
                    ))
                }
            }
        }
    })

    revalidatePath("/seller/order/list");

    for (const product of products) {
      if (!product.size) {
        await db.product.update({
          where: { id: product.productId },
          data: { totalStock: { decrement: product.quantity } },
        });
        return {
          success: "Order placed",
        };
      } else {
        const stock = await db.stock.findFirst({
          where: {
            productId: product.productId
          }
        })

        if (!stock) {
          throw new Error("Stock not found")
        }

        await db.stock.update({
          where: {
            id: stock.id,
            size: product.size
          },
          data: {
            stock: {decrement: product.quantity}
          }
        })

        const stocks = await db.stock.findMany({
          where: {
            productId: product.productId
          }
        })

        const totalStock = stocks.reduce((acc, curr) => acc+curr.stock,0)

        await db.product.update({
          where: {
            id: product.productId
          },
          data: {
            totalStock
          }
        })

        return {
          success: "Order placed",
        };
      }
    }
}