"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useAddress } from "@/store/use-address"

interface Props {
    addressId: string;
}

export const TrashButton = ({addressId}:Props) => {
    const { onOpen } = useAddress()
    
    return (
        <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-rose-500" onClick={() => onOpen(addressId)}>
            <Trash2 className="w-5 h-5" />
        </Button>
    )
}