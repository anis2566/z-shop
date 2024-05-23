"use client"

import { Bell } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { NotificationItem } from "@/components/dashboard/notification/notification-item"
import { useRef, useState } from "react"
import { NotificationCell, NotificationFeedPopover, NotificationIconButton } from "@knocklabs/react"
import Link from "next/link"

export const Notification = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const notifButtonRef = useRef(null);

    return (
        <div>
            <NotificationIconButton
                ref={notifButtonRef}
                onClick={(e) => setIsVisible(!isVisible)}
            />
            <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                renderItem={({ item, ...props }) => (
                    <NotificationCell {...props} item={item}>
                        <div className="rounded-xl">
                            <Link
                                className="text-blue-400 hover:text=blue-500"
                                onClick={() => {
                                    setIsVisible(false);
                                }}
                                href={`/items/${item.data.itemId}`}
                            >
                                Someone outbidded you on{" "}
                                <span className="font-bold">{item.data.itemName}</span>{" "}
                                by Anis
                            </Link>
                        </div>
                    </NotificationCell>
                )}
            />
        </div>
    )
}
