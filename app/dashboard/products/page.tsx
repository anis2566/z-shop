import { Pen } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { db } from "@/lib/db"
import { ProductList } from "@/components/dashboard/products/product-list"

interface Props {
  searchParams: {
      sort: string;
      page: string;
      perPage: string;
      search: string;
  }
};

const Products = async ({ searchParams }: Props) => {
    const {search, sort} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const products = await db.product.findMany({
        where: {
            ...(search && {name: {contains:search, mode: "insensitive"}})
        },
        include: {
            stocks: true,
        },
        orderBy: {
            ...(sort === 'asc' && { name: 'asc' }),
            ...(sort === 'desc' && { name: 'desc' }),
            ...(sort === 'high-to-low' && { price: 'desc' }),
            ...(sort === 'low-to-high' && { price: 'asc' }),
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    });

    const totalProducts = await db.product.count({
        where: {
            ...(search && {name: {contains:search, mode: "insensitive"}})
        }
    }) 

    const totalPage = totalProducts / itemsPerPage

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Products</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link href="/dashboard/products/create">
                    <Button size="sm" className="flex items-center gap-x-2">
                        <Pen className="w-5 h-5" />
                        Create
                    </Button>
                </Link>
            </div>
            <ProductList products={products} totalPage={totalPage} />
        </div>
    )
}

export default Products