"use client"

import { WithdrawApproveModal } from "@/components/dashboard/sellers/withdraw/withdraw-modal"
import { WithdrawModal } from "@/components/seller/withdraw/withdraw-modal"

export const ModalProvider = () => {
    return (
        <>
            <WithdrawModal />
            <WithdrawApproveModal />
        </>
    )
}