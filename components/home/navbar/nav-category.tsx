"use client"

import { LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { GET_CATEGORIES } from "@/actions/category.action"

export function NavbarCategory() {
    const {data:categories} = useQuery({
        queryKey: ["get-categories"],
        queryFn: async () => {
            const data = await GET_CATEGORIES()
            return data.categories
        },
        staleTime: 60 * 60 * 1000
    })

  return (
    <Menubar className="border-none p-0">
        <MenubarMenu>
            <MenubarTrigger className="p-0 bg-muted/80 text-primary data-[state=open]:bg-slate-300 data-[state=open]:text-primary">
                <div className="flex items-center gap-x-2 cursor-pointer p-2 rounded-sm">
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-lg">Browse All Category</span>
                </div>
            </MenubarTrigger>
              <MenubarContent align="end" className="w-[500px] p-4 border-slate-400-200 grid grid-cols-2 gap-x-5 gap-y-5">
                  {
                    categories && categories.map(category => (
                        <MenubarItem key={category.id} asChild>
                        <Link href={`/shop?category=${category.name}`} className="flex-1 border border-slate-300 hover:border-primary text-slate-800 hover:text-green-700 p-1 rounded-sm flex items-center gap-x-3 cursor-pointer transition-all" key={category.id}>
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                height={40}
                                width={40}
                            />
                            <span>{category.name}</span>
                        </Link>
                        </MenubarItem>
                    ))
                  }
            </MenubarContent>
        </MenubarMenu>
    </Menubar>
  )
}