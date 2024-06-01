"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
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

    const queryClient = useQueryClient()
    
    const {mutate: deleteAddress, isPending} = useMutation({
        mutationFn: DELETE_ADDRESS,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["user-address"],
                
            })
            queryClient.refetchQueries({ queryKey: ["user-address"] });
            onClose()
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
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete your address.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending} onClick={onClose}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}