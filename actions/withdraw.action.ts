"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { WithdrawSchema, WithdrawSchemaType } from "@/schema/withdraw"
import { getAdmin, getSeller, getUser } from "@/service/user.service"
import { sendNotification } from "@/service/notification.service"

export const CREATE_WITHDRAW = async (values: WithdrawSchemaType) => {
    const parseBody = WithdrawSchema.safeParse(values)
    if (!parseBody.success) {
        throw new Error("Invalid input Value")
    }

    const { sellerId, seller } = await getSeller()
    
    const bank = await db.bank.findUnique({
        where: {
            sellerId
        }
    })

    if (!bank) {
        throw new Error("Bank not found")
    }

    const { amount, method, number } = parseBody.data
    
    if (amount > bank.current) {
        throw new Error("Insufficient balance")
    }

    await db.withdraw.create({
        data: {
            sellerId,
            amount,
            method,
            number
        }
    })

    await db.bank.update({
        where: {
            sellerId
        },
        data: {
            current: { decrement: amount },
            withdraw: {increment: amount}
        }
    })

    revalidatePath("/seller/withdraw")

    const { adminClerId } = await getAdmin()
    const {clerkId} = await getUser()

    await sendNotification({
        trigger: "withdraw-request",
        recipients: [adminClerId],
        actor: {
            id: clerkId,
            name: seller.name
        }, 
        data: {
            redirectUrl: `/dashboard/withdraw`,
            withdraw: amount 
        }
    })

    return {
        success: "Request successful"
    }
}

type UpdateWithdraw = {
    withdrawId: string;
    status: string;
}

export const UPDATE_WITHDRAW = async ({withdrawId, status}:UpdateWithdraw) => {
    const withdraw = await db.withdraw.findUnique({
        where: {
            id: withdrawId
        }
    })

    if (!withdraw) {
        throw new Error("Withdraw not found")
    }

    if (status === "cancelled") {
        await db.bank.update({
            where: {
                sellerId: withdraw.sellerId
            },
            data: {
                current: { increment: withdraw.amount },
                withdraw: {decrement: withdraw.amount}
            }
        })
    }

    await db.withdraw.update({
        where: {
            id: withdraw.id
        },
        data: {
            status
        }
    })

    revalidatePath("/dashboard/sellers/withdraw")

    const seller = await db.seller.findUnique({
        where: {
            id: withdraw.sellerId
        },
        include: {
            user: {
                select: {
                    clerkId: true
                }
            }
        }
    })

    const {adminClerId} = await getAdmin()

    sendNotification({
        trigger: "withdraw-request-admin",
        recipients: [seller?.user.clerkId || ""],
        actor: {
            id: adminClerId
        },
        data: {
            status
        }
    })

    return {
        success: "Status updated"
    }
}