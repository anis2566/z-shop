import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function SellerRegister() {
    return (
        <div className="space-y-6 w-full h-screen pt-5 px-4">
            <div className="w-full flex justify-center">
                <div className="w-[100px] h-[100px] rounded-full shadow-md shadow-primary flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={70}
                        width={70}
                    />
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary text-center">Become a Seller</h1>
                <p className="mt-3 text-gray-500 dark:text-gray-400 text-center">
                    Join our marketplace and start selling your products today.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                </Card>
                
            </div>
        </div>
    )
}