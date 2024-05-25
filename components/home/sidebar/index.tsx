"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"

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
            <SheetContent side="left" className="w-[250px]">
                <div className="border-r bg-muted/40 md:block fixed left-0 top-0 min-h-screen w-[250px]">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Logo callbackUrl="/" />
                        </div>
                        {/* <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
                            {
                                CLIENT_UI_SIDEBAR.map((item) => {
                                    const active = item.href === pathname
                                    return (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", active && "bg-muted text-primary hover:text-primary")}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </SheetClose>
                                    )
                                })
                            }
                        </nav> */}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}