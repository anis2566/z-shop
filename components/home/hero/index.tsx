import { Banner } from "../banner"
import { HeroCategory } from "./category"

export const Hero = () => {
    return (
        <div className="mt-[20px] w-full max-w-screen-xl mx-auto flex bg-rose-500">
            <HeroCategory />
            <Banner />
        </div>
    )
}