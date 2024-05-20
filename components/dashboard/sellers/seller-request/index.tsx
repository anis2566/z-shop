"use client"

import { EllipsisVertical, Eye, Pen, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Category, Seller } from "@prisma/client"

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

import { DELETE_CATEGORY } from "@/actions/category.action"
import { Header } from "@/components/dashboard/sellers/seller-request/header"
import { Badge } from "@/components/ui/badge"
import { PaginationComp } from "@/components/pagination-comp"

interface Props {
    sellers: Seller[];
    totalPage: number
}

export const SellerRequest = ({sellers, totalPage}:Props) => {

    const pathname = usePathname()
    const router = useRouter()
    const categoryId = useSearchParams().get("categoryId")

    const handleClick = (categoryId: string) => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                categoryId
            }
        }, { skipEmptyString: true, skipNull: true })
        
        router.push(url)
    }

    const hanldeClose = () => {
        router.push(pathname)
    }

    const {mutate: deleteCategory, isPending} = useMutation({
        mutationFn: DELETE_CATEGORY,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "delete-brand"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-brand"
            });
        }
    })

    const hanldeDelete = () => {
        toast.loading("Brand deleting...", {
            id: "delete-brand"
        })
        if (categoryId) {
            deleteCategory(categoryId)
        } else {
            toast.error("Brand ID is missing", {
                id: "delete-brand"
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
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
                                <TableCell className="py-2">{seller.email}</TableCell>
                                <TableCell className="py-2">
                                    <Badge className="bg-amber-500 capitalize">{seller.status}</Badge>    
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
                                                <Link href={`/dashboard/sellers/edit/${seller.id}`} className="flex items-center gap-x-3">
                                                    <Pen className="w-4 h-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => handleClick(seller.id)}>
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
                {/* <AlertDialog open={!!categoryId} onOpenChange={hanldeClose}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will delete the brand permanantly.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={hanldeDelete} disabled={isPending}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog> */}
            </CardContent>
        </Card>
    )
}