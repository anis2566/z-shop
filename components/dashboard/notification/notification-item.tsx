import { format } from "date-fns"
import { Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const NotificationItem = () => {
    return (
        <div
            className="flex items-center justify-between gap-x-2 hover:bg-muted/60 p-2 rounded-md cursor-pointer"
        >
            <div className="flex items-center gap-x-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>NO</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                    You have a new message
                </p>
                <div className="flex items-center gap-x-2">
                    <Badge>New Order</Badge>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(), "dd MMMM yyyy")}
                    </p>
                </div>
            </div>
            </div>
            <Button size="icon" variant="ghost">
                <Trash2 className="h-5 w-5 text-rose-500" />
            </Button>
        </div>
    )
}