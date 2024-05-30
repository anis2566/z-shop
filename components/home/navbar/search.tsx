import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Search = () => {
    return (
        <form className="hidden sm:flex border border-primary rounded-xl py-1 px-2 relative flex-1 max-w-[600px]">
            <Input className="border-none focus-visible:ring-0 focus-visible:ring-none w-full" placeholder="What are you looking?" />
            <Button type="submit" variant="ghost" size="icon" className="absolute top-1 right-2">
                <SearchIcon className="w-5 h-5 text-primary" />
            </Button>
        </form>
    )
}