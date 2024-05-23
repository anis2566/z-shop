"use client"

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
                    item.data.sellerOrderId ? (
                        <Link href={`/dashboard/sellers/orders/${item.data.sellerOrderId}`} key={item.id} onClick={() => setIsVisible(false)}>
                            <NotificationCell {...props} item={item} />
                        </Link>
                    ) : null
                )}
            />
        </div>
    )
}
