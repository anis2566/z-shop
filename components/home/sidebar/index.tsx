"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Logo } from "@/components/logo"
import { NAVBAR_DATA } from "@/constant"
import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
}

export function Sidebar({ children }: Props) {
    const pathname = usePathname()

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] space-y-3">
                <SheetHeader>
                    <Logo callbackUrl="/" />
                </SheetHeader>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {
                        NAVBAR_DATA.map((nav, i) => {
                            const active = nav.path === pathname
                            return (
                                <SheetClose asChild key={nav.path}>
                                    <Link
                                        href={nav.path}
                                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", active && "bg-muted text-primary hover:text-primary")}
                                    >
                                        {nav.label}
                                    </Link>
                                </SheetClose>
                            )
                        })
                    }
                </nav>
            </SheetContent>
        </Sheet>
    )
}