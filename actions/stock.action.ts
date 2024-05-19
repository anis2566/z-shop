"use server"

import { db } from "@/lib/db"
import { StockVariantSchema, StockVariantSchemaType } from "@/schema/stock"

export const CREATE_STOCK = async (values: StockVariantSchemaType) => {
    const parseBody = StockVariantSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const {stocks, productId} = parseBody.data

    await Promise.all(stocks.map(stock => 
        db.stock.create({
            data: {
                productId: productId,
                size: stock.size,
                stock: stock.stock
            }
        })
    ))

    const totalStock = stocks.reduce((acc, curr) => acc + curr.stock, 0)
    
    await db.product.update({
        where: {
            id: productId
        },
        data: {
            totalStock
        }
    })

    return {
        success: "Stock created"
    }

}

export const UPDATE_STOCK = async (values: StockVariantSchemaType) => {
    const parseBody = StockVariantSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const { stocks, productId } = parseBody.data
    
    await Promise.all(stocks.map(stock => (
        db.stock.deleteMany({
            where: {
                productId: productId
            }
        })
    )))

    await Promise.all(stocks.map(stock => 
        db.stock.create({
            data: {
                productId: productId,
                size: stock.size,
                stock: stock.stock
            }
        })
    ))

    return {
        success: "Stock updated"
    }

}