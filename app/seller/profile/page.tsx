import { ImageForm } from "@/components/seller/profile/image-form"
import { PaymentForm } from "@/components/seller/profile/payment-form"
import { PersonalInfoForm } from "@/components/seller/profile/personalinfo-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { getUser } from "@/service/user.service"
import Image from "next/image"
import { redirect } from "next/navigation"


const Profile = async () => {
    const { userId } = await getUser()

    const seller = await db.seller.findUnique({
        where: {
            userId
        }
    })

    if(!seller) redirect("/")

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/seller">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6 md:col-span-2">
                    <Card>
                        <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="100"
                                src={seller.imageUrl}
                                style={{
                                    aspectRatio: "100/100",
                                    objectFit: "cover",
                                    }}
                                width="100"
                            />
                            <div className="grid gap-1 text-sm md:gap-2">
                                <div className="font-semibold text-xl">Hello, <span className="text-primary">{seller.name}</span></div>
                                <div>{seller.email}</div>
                                <div>{seller.phone}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <PersonalInfoForm seller={seller} />
                </div>
                <div className="space-y-6">
                    <ImageForm seller={seller} />
                    <PaymentForm seller={seller} />
                </div>
            </div>
            
        </div>
    )
}

export default Profile