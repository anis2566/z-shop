"use client"

import {Brand} from "@prisma/client"
import { EllipsisVertical, Pen,Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Header } from "@/components/dashboard/brand/header"

interface BrandListProps {
    brands: Brand[]
}

export const BrandList = ({brands}:BrandListProps) => {
    const [id, setId] = useState<string>("")
    const [pending, startTransition] = useTransition()

    // const handleDelete = async () => {
    //     if (!id) {
    //         toast.error("Something went wrong")
    //     } else {
    //         startTransition(() => {
    //             deleteBrand(id)
    //                 .then(data => {
    //                     if (data?.error) {
    //                     toast.error(data?.error)
    //                     }
    //                     if (data?.success) {
    //                         toast.success(data?.success)
    //                 }
    //             })
    //         })
    //     }
    // }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            brands.map(brand => (
                            <TableRow key={brand.id}>
                                <TableCell className="py-2">
                                <Avatar className="w-9 h-9">
                                    <AvatarImage src={brand.imageUrl} />
                                    <AvatarFallback>{brand.name}</AvatarFallback>
                                </Avatar>
                                </TableCell>
                                <TableCell className="py-2">{brand.name}</TableCell>
                                <TableCell className="py-2">10</TableCell>
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
                                        <Link href={`/dashboard/brand/edit/${brand.id}`} className="flex items-center gap-x-3">
                                            <Pen className="w-4 h-4" />
                                                Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                    <AlertDialogTrigger className="flex gap-x-3 text-rose-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 select-none items-center rounded-sm px-2 py-1.5 text-sm w-full" onClick={() => setId(brand.id)}>
                                        <Trash2 className="text-rose-500 w-4 h-4" />
                                        Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will delete the brand permanantly.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                    </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}