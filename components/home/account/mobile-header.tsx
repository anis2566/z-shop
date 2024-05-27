"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { USER_NAVBAR } from "@/constant"
import { cn } from "@/lib/utils"

export const MobileHeader = () => {
    const pathname = usePathname()

    return (
        <div className="md:hidden pt-4 md:pt-10 mx-auto flex flex-wrap flex-col">
            <div className="flex mx-auto flex-wrap mb-5">
                {
                    USER_NAVBAR.map((nav) => {
                        const active = nav.href === pathname
                        return (
                            <Link
                                key={nav.href}
                                href={nav.href}
                                className={cn(
                                    "sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start title-font border-b-2 border-gray-200 font-medium hover:bg-muted/60 inline-flex items-center leading-none hover:text-primary tracking-wider rounded-t flex items-center gap-x-2",
                                    active && "border-b-2 border-primary bg-muted text-primary"
                                )}>
                                <nav.icon className="h-5 w-5" />
                                {nav.label}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}