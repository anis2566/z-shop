"use client"

import { useEffect, useRef, useState } from "react"
import { NotificationCell, NotificationFeedPopover, NotificationIconButton, useKnockClient } from "@knocklabs/react"
import Link from "next/link"
import { useAuth, useSession } from "@clerk/nextjs"

export const Notification = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const notifButtonRef = useRef(null);
    const { userId } = useAuth()
    const { session } = useSession()
    const knock = useKnockClient()
    
    useEffect(() => {
        console.log("rendered")
        if (userId) {
            knock.authenticate(userId)
        }
    },[knock, userId])
    

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
