import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Notification } from "@/components/seller/notification"

export const NavMenu = async () => {

    return (
        <div className="flex items-center gap-x-2">
            <ModeToggle />
            <Notification />
            <ClerkLoading>
                <Loader className="w-5 h-5 animate-spin" />
              </ClerkLoading>
              <ClerkLoaded>
                <UserButton afterSignOutUrl="/sign-in" />
            </ClerkLoaded>
        </div>
    )
}