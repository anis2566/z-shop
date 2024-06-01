"use client"

import { ClerkLoaded, ClerkLoading, SignOutButton, SignedOut, SignedIn, SignInButton } from "@clerk/nextjs"
import {User, UserCog, MapPinned, Heart, LogOut, Loader2} from "lucide-react"
import { User as PrismaUser } from "@prisma/client"
import { useEffect, useState } from "react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { getUser } from "@/service/user.service"


export const Account = () => {
    const [user, setUser] = useState<PrismaUser | null>();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
          const { user } = await getUser();
          setUser(user);
        };
    
        fetchUser();
        setIsClient(true);
      }, []);

      if (!isClient) {
        return null;
      }

    return (
        <div>
            <SignedOut>
              <ClerkLoading>
                <Loader2 className="w-5 h-5 animate-spin" />
              </ClerkLoading>
                <SignInButton mode="modal">
                    <Button variant="outline" size="icon" asChild>
                        <User className="h-[1.2rem] w-[1.2rem] dark:text-white" />
                        <span className="sr-only">Open Login</span>
                    </Button>
                </SignInButton >
            </SignedOut>

            <SignedIn >
                <ClerkLoading>
                    <Loader2 className="w-5 h-5 animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link 
                                    href="/account"
                                    className="flex items-center gap-x-2"
                                >
                                    <UserCog className="w-5 h-5" /> My Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/order-tracking" className="flex items-center gap-x-2">
                                    <MapPinned className="w-5 h-5" /> Order Tracking
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/wishlist" className="flex items-center gap-x-2">
                                    <Heart className="w-5 h-5" /> My Wishlist
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-0">
                                <SignOutButton>
                                    <Button variant="ghost" className="py-0 flex items-center gap-x-2 ">
                                        <LogOut className="w-5 h-5" /> Logout
                                    </Button>
                                </SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ClerkLoaded>
            </SignedIn>
        </div>
    )
}