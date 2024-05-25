"use client"

import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useWithdrawApprove } from "@/store/use-withdraw"
import { zodResolver } from "@hookform/resolvers/zod"
import { UPDATE_WITHDRAW } from "@/actions/withdraw.action"

const formSchema = z.object({
    status: z.string().min(1, {
        message: "required"
    })
})

export const WithdrawApproveModal = () => {

    const {open, onClose, withdrawId} = useWithdrawApprove()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "",
        },
    })

    const {mutate: createWithdraw, isPending} = useMutation({
        mutationFn: UPDATE_WITHDRAW,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "update-withdraw"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-withdraw"
            });
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Status updating...", {
            id: "update-withdraw"
        })
        createWithdraw({withdrawId, status:values.status})
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw Approval</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                ["success", "cancelled"].map((v, i) => (
                                                    <SelectItem value={v} key={i} className="capitalize">{v}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}