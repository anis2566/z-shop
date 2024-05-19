import { redirect } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { db } from "@/lib/db"
import {EditBrand as EditBrandComp} from "@/components/dashboard/brand/edit-brand"

const EditBrand = async ({params}:{params:{brandId:string}}) => {

    const brand = await db.brand.findUnique({
        where: {
            id:params.brandId
        }
    })

    if(!brand) redirect("/")

    return (
        <div className="w-full space-y-4 max-w-3xl">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/brand">Brand</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditBrandComp brand={brand} />
        </div>
    )
}

export default EditBrand