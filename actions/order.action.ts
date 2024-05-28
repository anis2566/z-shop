"use server"

import { db } from "@/lib/db";
import { generateInvoiceId } from "@/lib/utils";
import { OrderProductSchemaType, OrderSchema, OrderSchemaType } from "@/schema/order"
import { getAdmin, getUser } from "@/service/user.service";

type CreateOrder = {
    order: OrderSchemaType;
    products: OrderProductSchemaType[]
}

export const CREATE_ORDER = async ({order, products}:CreateOrder) => {
    const parseOrder = OrderSchema.safeParse(order)

    if(!parseOrder.success) {
        throw new Error("Invalid input value")
    }

    const {addressId, deliveryFee, paymentMethod, recepient, division, address, phone} = parseOrder.data
    const {userId} = await getUser()

    const total = products.reduce((acc, curr) => acc + curr.price,0)

    if(addressId) {
        await db.order.create({
            data: {
                userId,
                invoiceId: generateInvoiceId(),
                total,
                deliveryFee,
                paymentMethod,
                products: {
                    createMany: {
                        data: products
                    }
                },
                addressId
            }
        })

    } else {
        const newAddress = await db.address.create({
            data: {
                recepient,
                division,
                address,
                phone
            }
        })

        await db.order.create({
            data: {
                userId,
                invoiceId: generateInvoiceId(),
                total,
                deliveryFee,
                paymentMethod,
                products: {
                    createMany: {
                        data: products
                    }
                },
                addressId: newAddress.id
            }
        })
    }

    for(const product of products) {
        if(product.size) {
            const stock = await db.stock.findFirst({
                where: {
                    productId: product.productId
                }
            })

            if(!stock) {
                throw new Error("Stock not found")
            }

            await db.stock.update({
                where: {
                    id: stock.id
                },
                data: {
                    stock: {decrement: product.quantity}
                }
            })

            await db.product.update({
                where: {
                    id: product.productId
                },
                data: {
                    totalStock: {decrement: product.quantity}
                }
            })
        } else {
            const test = await db.product.update({
                where: {
                    id: product.productId
                },
                data: {
                    totalStock: {decrement: product.quantity}
                }
            })
        }
    }

    return {
        success: "Order placed"
    }

}