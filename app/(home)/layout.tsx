import { Footer } from "@/components/home/footer"
import { Navbar } from "@/components/home/navbar"
import {Cart} from "@/components/home/cart"

const HomeLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="w-full bg-gray-100 relative">
            <Navbar />
            {children}
            <Cart />
            <Footer />
        </div>
    )
}

export default HomeLayout