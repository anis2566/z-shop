import { Navbar } from "@/components/seller/navbar"
import { Pending } from "@/components/seller/pending"
import { Sidebar } from "@/components/seller/sidebar"
import { auth } from "@clerk/nextjs/server"

const SellerLayout = async ({children}:{children:React.ReactNode}) => {
    const { sessionClaims } = auth()
    const status = sessionClaims?.status

    // if (status === "pending") {
    //     return (
    //         <Pending />
    //     )
    // }

    return (
        <main className="w-full flex">
            <Sidebar />
            <section className="flex-1 md:ml-[220px]">
            <Navbar />
            <div className="p-2 md:p-4">
                {children}
            </div>
            </section>
        </main>
    )
}

export default SellerLayout