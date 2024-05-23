"use client"

import { useEffect, useRef, useState } from "react"
import { NotificationCell, NotificationFeedPopover, NotificationIconButton, useKnockClient } from "@knocklabs/react"
import Link from "next/link"
import { useAuth, useSession } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

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
                        <div className="flex justify-end">
                            {
                                item.data.sellerOrderId && (
                                    <Button asChild variant="outline" onClick={() => setIsVisible(false)} size="sm">
                                        <Link href={`/dashboard/sellers/orders/${item.data.sellerOrderId}`}>View Order</Link>
                                    </Button>
                                )
                            }
                        </div>
                    </NotificationCell>
                )}
            />
        </div>
    )
}
