"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NAVBAR_DATA } from "@/constant"
import { cn } from "@/lib/utils"

export function NavbarNav() {
    const pathname = usePathname()
    
  return (
    <div className="flex items-center gap-x-7">
          {
              NAVBAR_DATA.map(nav => {
                  const active = nav.path === pathname
                  return (
                    <Link href={nav.path} className={cn("flex items-center gap-x-1 text-slate-800 hover:text-primary/80 font-semibold transition-all duration-100", active && "text-primary")} key={nav.path}>
                        {nav.label}
                    </Link>
                  )}
              )
          }
    </div>
  )
}