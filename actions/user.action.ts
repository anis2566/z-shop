"use server"

import { db } from "@/lib/db"
import { UserSchema, UserSchemaType } from "@/schema/user"
import { getUser } from "@/service/user.service"


export const UPDATE_PROFILE = async (values: UserSchemaType) => {
    const {success, data} = UserSchema.safeParse(values)

    if(!success) {
        throw new Error("Invalid input value")
    }

    const {userId} = await getUser()

    await db.user.update({
        where: {
            id: userId
        },
        data: {
            ...data
        }
    })

    return {
        success: "Profile updated"
    }
}


export const GET_USER_DASHBOARD_DATA = async () => {
    const { userId } = await getUser();

    const orders = await db.order.groupBy({
        by: ['status'],
        where: {
            userId
        },
        _count: {
            _all: true
        }
    });

    let totalOrders = 0;
    let pendingOrder = 0;
    let deliveredOrder = 0;

    orders.forEach(order => {
        totalOrders += order._count._all;
        if (order.status === "pending") {
            pendingOrder = order._count._all;
        } else if (order.status === "delivered") {
            deliveredOrder = order._count._all;
        }
    });

    console.log(totalOrders, pendingOrder,deliveredOrder)

    return {
        totalOrders,
        pendingOrder,
        deliveredOrder
    };
}



export const GET_UNREVIEWED_PRODUCT = async () => {
    const {userId} = await getUser()

    const orders = await db.order.findMany({
        where: {
            userId,
            status: "delivered"
        },
        include: {
            products: true
        }
    });

    // Extract productIds from orders
    const productIds = orders.flatMap(order => 
        order.products.map(product => product.productId)
    );

    const products = await db.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })

    return {products}
}