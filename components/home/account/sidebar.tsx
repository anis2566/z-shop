"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { USER_NAVBAR } from "@/constant"
import { cn } from "@/lib/utils"

export const Sidebar = () => {
    const pathname = usePathname() 
    return (
        <div className="w-[200px] flex-shrink-0 border-r-2 border-muted">
            {
                USER_NAVBAR.map((nav) => {
                    const active = pathname === nav.href
                    return (
                        <Link href={nav.href} key={nav.href} className="w-full group">
                            <div className="flex relative pb-12 items-center">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center group-last-of-type:hidden">
                                    <div className="h-full w-1 pointer-events-none bg-indigo-500"></div>
                                </div>
                                <div
                                    className={cn(
                                        "flex-shrink-0 w-10 h-10 rounded-full bg-gray-400 inline-flex items-center justify-center text-white relative z-10 group-hover:bg-primary",
                                        active && "bg-primary"
                                    )}
                                >
                                    <nav.icon className="w-5 h-5 text-muted" />
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2
                                        className={cn(
                                            "font-medium title-font text-sm text-gray-900 mb-1 tracking-wider group-hover:text-primary",
                                            active && "text-primary font-bold"
                                        )}
                                    >
                                        {nav.label}
                                    </h2>
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}