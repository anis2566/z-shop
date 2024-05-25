import { Header } from "@/components/home/header"
import { Navbar } from "@/components/home/navbar"

const HomeLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="w-full">
            <Header />
            <Navbar />
            {children}
        </div>
    )
}

export default HomeLayout