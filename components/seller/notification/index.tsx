import {Bell} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { NotificationItem } from "@/components/dashboard/notification/notification-item"

export const Notification = () => {
    return (
        <DropdownMenu> 
            <DropdownMenuTrigger asChild>
                <div className="relative">
                    <Button variant="outline" size="icon">
                        <Bell className="h-[1.2rem] w-[1.2rem] dark:text-white" />
                        <span className="sr-only">Open Notification</span>
                    </Button>
                    <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-rose-500 text-white">5</div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="space-y-1 p-2">
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
