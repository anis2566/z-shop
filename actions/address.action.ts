"use server"

import { db } from "@/lib/db"
import { AddressShema, AddressShemaType } from "@/schema/address"
import { getUser } from "@/service/user.service"
import { revalidatePath } from "next/cache"

export const CREATE_ADDRESS = async (values: AddressShemaType) => {
    const parseBody = AddressShema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const address = await db.address.findFirst({
        where: {
            title: values.title
        }
    })

    if (address) {
        throw new Error("Addres with this title exist")
    }

    const {userId} = await getUser()

    await db.address.create({
        data: {
            userId,
            ...values
        }
    })

    revalidatePath("/account/address")

    return {
        success: "Address saved"
    }
}


export const GET_USER_ADDRESS = async () => {
    const { userId } = await getUser()
    
    const addresses = await db.address.findMany({
        where: {
            userId,
            title: {
                not: ""
            }
        }
    })

    return {
        addresses
    }
}


export const DELETE_ADDRESS = async (id: string) => {
    const address = await db.address.findUnique({
        where: {
            id
        }
    })

    if (!address) {
        throw new Error("Address not found")
    }

    await db.address.delete({
        where: {
            id
        }
    })

    revalidatePath("/account/address")

    return {
        success: "Address deleted"
    }
}