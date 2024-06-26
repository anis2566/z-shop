"use client"

import { WithdrawApproveModal } from "@/components/dashboard/sellers/withdraw/withdraw-modal"
import { AddressModal } from "@/components/modal/address-modal"
import { QuickViewModal } from "@/components/modal/quick-view"
import { WithdrawModal } from "@/components/seller/withdraw/withdraw-modal"

export const ModalProvider = () => {
    return (
        <>
            <WithdrawModal />
            <WithdrawApproveModal />
            <QuickViewModal />
            <AddressModal />
        </>
    )
}