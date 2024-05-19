"use client"

import { EllipsisVertical, Pen, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Product, Stock } from "@prisma/client"

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

import { Header } from "../brand/header"
import { PaginationComp } from "@/components/pagination-comp"
import { DELETE_CATEGORY } from "@/actions/category.action"

interface ProductWithStock extends Product {
    stocks?: Stock[]
}

interface Props {
    products: ProductWithStock[];
    totalPage: number
}

export const ProductList = ({ products, totalPage }: Props) => {

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
                <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Image</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Price</TableHead>
                        <TableHead className="">D. Price</TableHead>
                        <TableHead className="">S. Price</TableHead>
                        <TableHead className="">Stock</TableHead>
                        <TableHead className="">Status</TableHead>
                        <TableHead className="">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell className="py-2">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={product.featureImageUrl} />
                                        <AvatarFallback>{product.name}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2">{product.name.slice(0,30)}</TableCell>
                                <TableCell className="py-2">{product.price}</TableCell>
                                <TableCell className="py-2">{product.discountPrice}</TableCell>
                                <TableCell className="py-2">{product.sellerPrice}</TableCell>
                                <TableCell className="py-2">{product.totalStock}</TableCell>
                                <TableCell className="py-2">{product.status}</TableCell>
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
                                                <Link href={`/dashboard/products/edit/${product.id}`} className="flex items-center gap-x-3">
                                                    <Pen className="w-4 h-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-flex items-center gap-x-3" onClick={() => handleClick(product.id)}>
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