"use client"

import { EllipsisVertical, Pen, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Coupon } from "@prisma/client"
import { format } from "date-fns"

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
import { PaginationComp } from "@/components/pagination-comp"

import { cn } from "@/lib/utils"
import { Header } from "@/components/dashboard/coupon/header"
import { DELETE_COUPON } from "@/actions/coupon.action"

interface Props {
    coupons: Coupon[];
    totalPage: number
}

export const CouponList = ({ coupons, totalPage }: Props) => {

    const pathname = usePathname()
    const router = useRouter()
    const couponId = useSearchParams().get("couponId")

    const handleClick = (couponId: string) => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                couponId
            }
        }, { skipEmptyString: true, skipNull: true })
        
        router.push(url)
    }

    const hanldeClose = () => {
        router.push(pathname)
    }

    const {mutate: deleteCoupon, isPending} = useMutation({
        mutationFn: DELETE_COUPON,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "delete-coupon"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-coupon"
            });
        }
    })

    const hanldeDelete = () => {
        toast.loading("Coupon deleting...", {
            id: "delete-coupon"
        })
        if (couponId) {
            deleteCoupon(couponId)
        } else {
            toast.error("Brand ID is missing", {
                id: "delete-coupon"
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Coupon List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Image</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Code</TableHead>
                        <TableHead className="">Value</TableHead>
                        <TableHead className="">Start</TableHead>
                        <TableHead className="">End</TableHead>
                        <TableHead className="">Status</TableHead>
                        <TableHead className="">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            coupons.map(coupon => (
                            <TableRow key={coupon.id}>
                                <TableCell className="py-2">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={coupon.imageUrl || ""} />
                                        <AvatarFallback>C</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2">{coupon.name}</TableCell>
                                <TableCell className="py-2 uppercase">{coupon.code}</TableCell>
                                <TableCell className="py-2 uppercase">{coupon.value}</TableCell>
                                <TableCell className="py-2 uppercase">{format(coupon.startDate, "dd MMMM yyyy")}</TableCell>
                                <TableCell className="py-2 uppercase">{format(coupon.startDate, "dd MMMM yyyy")}</TableCell>
                                <TableCell className="py-2 uppercase">
                                    <Badge className={cn("", coupon.status === "INACTIVE" && "bg-rose-500")}>{coupon.status}</Badge>    
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
                                                <Link href={`/dashboard/coupon/edit/${coupon.id}`} className="flex items-center gap-x-3">
                                                    <Pen className="w-4 h-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => handleClick(coupon.id)}>
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
                <AlertDialog open={!!couponId} onOpenChange={hanldeClose}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the coupon permanantly.
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