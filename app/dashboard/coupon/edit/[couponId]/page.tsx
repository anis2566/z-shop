import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {db} from "@/lib/db"
import { redirect } from "next/navigation"
import {EditCoupon as EditCouponComp} from "@/components/dashboard/coupon/edit-coupon"

const EditCoupon = async ({params}:{params:{id:string}}) => {

    const coupon = await db.coupon.findFirst({
        where: {
            id:params.id
        }
    })

    if(!coupon) redirect("/") 

    return (
        <div className="w-full space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/coupon">Coupon</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditCouponComp coupon={coupon} />
        </div>
    )
}

export default EditCoupon