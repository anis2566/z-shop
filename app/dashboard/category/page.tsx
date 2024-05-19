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
import { CategoryList } from "@/components/dashboard/category/category-list"
import { db } from "@/lib/db"

interface Props {
  searchParams: {
      sort: string;
      page: string;
      perPage: string;
      search: string;
  }
};

const Category = async ({ searchParams }: Props) => {

    const {search, sort} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const categories = await db.category.findMany({
        where: {
            ...(search && {
                name: {
                    contains: search, mode: "insensitive"
                }
            })
        },
        orderBy: {
            ...(sort === 'asc' && { name: 'asc' }),
            ...(sort === 'desc' && { name: 'desc' }),
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalCategory = await db.category.count({
        where: {
            ...(search && {
                name: {
                    contains: search, mode: "insensitive"
                }
            })
        }
    }) 

    const totalPage = totalCategory / itemsPerPage

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashobard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Category</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link href="/dashboard/category/create">
                    <Button size="sm">Create</Button>
                </Link>
            </div>
            <CategoryList categories={categories} totalPage={totalPage} />
        </div>
    )
}

export default Category