import { MobileHeader } from "@/components/home/account/mobile-header"
import { Sidebar } from "@/components/home/account/sidebar"

const AccountLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="px-4 max-w-screen-xl mx-auto bg-white my-6 pb-6">
            <MobileHeader />
            <div className="hidden md:flex gap-x-4 pt-5 md:pt-10">
                <Sidebar />
                {children}
            </div>
            <div className="md:hidden">
                {children}
            </div>
        </div>
    )
}

export default AccountLayout