"use client"

import { CircleUser, EllipsisVertical, Pen, Trash2, UserCog } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Seller } from "@prisma/client"
import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { PaginationComp } from "@/components/pagination-comp"
import { DELETE_SELLER, UPDATE_SELLER_STATUS } from "@/actions/seller.action"
import { cn } from "@/lib/utils"
import { Header } from "./header"

export enum Status {
    Active = "active",
    Inactive = "inactive"
}

interface Props {
    sellers: Seller[];
    totalPage: number
}

export const SellerList = ({ sellers, totalPage }: Props) => {
    const [status, setStatus] = useState<Status | "">("")

    const pathname = usePathname()
    const router = useRouter()
    const sellerId = useSearchParams().get("sellerId")
    const update = useSearchParams().get("update")
    const deleteRef = useSearchParams().get("delete")

    const handleClickStatus = (sellerId: string) => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                sellerId,
                update: "true"
            }
        }, { skipEmptyString: true, skipNull: true })
        
        router.push(url)
    }

   
    const handleClickDelete = (sellerId: string) => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                sellerId,
                delete: "true"
            }
        }, { skipEmptyString: true, skipNull: true })
        
        router.push(url)
    }

    const hanldeClose = () => {
        router.push(pathname)
    }

    const {mutate: updateStatus, isPending:isPendingStatus} = useMutation({
        mutationFn: UPDATE_SELLER_STATUS,
        onSuccess: (data) => {
            hanldeClose()
            toast.success(data.success, {
                id: "update-status"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-status"
            });
        }
    })

    const {mutate: deleteSeller, isPending} = useMutation({
        mutationFn: DELETE_SELLER,
        onSuccess: (data) => {
            hanldeClose()
            toast.success(data.success, {
                id: "delete-seller"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-seller"
            });
        }
    })

    const handleUpdate = () => {
        toast.loading("Status updating...", {
            id: "update-status"
        })

        if (!status || !sellerId) {
            toast.error("Something went wrong", {
                id: "update-status"
            })
        } else if (sellerId) {
            updateStatus({ sellerId, status })
        } else {
            toast.error("Seller ID is missing", {
                id: "update-status"
            })
        }
    }

    const hanldeDelete = () => {
        toast.loading("Status updating...", {
            id: "delete-seller"
        })

        if (!status || !sellerId) {
            toast.error("Something went wrong", {
                id: "delete-seller"
            })
        } else if (sellerId) {
            deleteSeller(sellerId)
        } else {
            toast.error("Seller ID is missing", {
                id: "delete-seller"
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sellers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[310px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            sellers.map(seller => (
                            <TableRow key={seller.id}>
                                <TableCell className="py-2">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={seller.imageUrl} />
                                        <AvatarFallback>{seller.name}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2">{seller.name}</TableCell>
                                <TableCell className="py-2">{seller.phone}</TableCell>
                                <TableCell className="py-2 hidden md:table-cell">{seller.email}</TableCell>
                                <TableCell className="py-2">
                                        <Badge
                                            className={cn("bg-amber-500 capitalize",
                                                seller.status === "active" && "bg-green-500",
                                                seller.status === "inactive" && "bg-rose-500",
                                            )}
                                        >
                                            {seller.status}
                                        </Badge>    
                                </TableCell>
                                <TableCell className="py-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/sellers/${seller.id}`} className="flex items-center gap-x-3">
                                                    <CircleUser className="w-4 h-4" />
                                                    View Profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => handleClickStatus(seller.id)}>
                                                <UserCog className="w-4 h-4" />
                                                Change Status
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/sellers/edit/${seller.id}`} className="flex items-center gap-x-3">
                                                    <Pen className="w-4 h-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => handleClickDelete(seller.id)}>
                                                <Trash2 className="text-rose-500 w-4 h-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <PaginationComp totalPage={totalPage} />
                <Dialog open={!!sellerId && !!update} onOpenChange={hanldeClose}>
                    <DialogContent className="space-y-5">
                        <DialogHeader>
                            <DialogTitle>Change Status</DialogTitle>
                        </DialogHeader>
                        <Select onValueChange={(value) => setStatus(value as Status)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    ["active", "inactive"].map((v, i) => (
                                        <SelectItem key={i} value={v} className="capitalize">{v}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                        <Button disabled={!status || isPendingStatus} onClick={handleUpdate}>Update</Button>
                    </DialogContent>
                </Dialog>
                <AlertDialog open={!!sellerId && !!deleteRef} onOpenChange={hanldeClose}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the seller permanantly.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={hanldeDelete} disabled={isPending}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}