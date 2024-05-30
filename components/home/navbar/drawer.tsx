"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Logo } from "@/components/logo"

type Props = {
    children: React.ReactNode
}

export function NavDrawer ({ children }: Props) {

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
                    navbar
                </nav>
            </SheetContent>
        </Sheet>
    )
}