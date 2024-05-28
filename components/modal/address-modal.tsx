"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useAddress } from "@/store/use-address"
import { DELETE_ADDRESS } from "@/actions/address.action"

export const AddressModal = () => {
    const { open, onClose, addressId } = useAddress()
    
    const {mutate: deleteAddress, isPending} = useMutation({
        mutationFn: DELETE_ADDRESS,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "delete-address"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-address"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Address deleting...", {
            id: "delete-address"
        })
        deleteAddress(addressId)
    }

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete your address.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}