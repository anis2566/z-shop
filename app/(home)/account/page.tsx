import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import { format } from "date-fns"
import Link from "next/link"
import { Eye } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Wishlist } from "@/components/home/account/wishlist"
import { Review } from "@/components/home/account/review"

const Account = async () => {
    const user = await currentUser()
    
    return (
        <div className="space-y-10">
            <Card className="w-full">
                <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                    <Image
                        alt="Avatar"
                        className="rounded-full"
                        height="60"
                        src={user?.imageUrl || ""}
                        style={{
                        aspectRatio: "100/100",
                        objectFit: "cover",
                        }}
                        width="60"
                    />
                    <div className="grid gap-1 text-sm md:gap-2">
                            <div className="font-semibold text-xl">{`${user?.firstName}`} <span className="text-primary">{user?.lastName}</span></div>
                        <div>{user?.emailAddresses[0].emailAddress}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Explore your lates orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead >Products</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="p-0">
                                <TableCell className="py-1 flex items-center gap-x-2">
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-1">
                                    500
                                </TableCell>
                                <TableCell className="hidden md:table-cell py-1">
                                    {format(new Date(), "dd MMMM yyyy")}
                                </TableCell>
                                <TableCell className="py-1">
                                    <Badge>Pending</Badge>
                                </TableCell>
                                <TableCell className="py-1">
                                    <Link href={`/account/orders/123`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-5 h-5 text-primary" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow className="p-0">
                                <TableCell className="py-1 flex items-center gap-x-2">
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-1">
                                    500
                                </TableCell>
                                <TableCell className="hidden md:table-cell py-1">
                                    {format(new Date(), "dd MMMM yyyy")}
                                </TableCell>
                                <TableCell className="py-1">
                                    <Badge>Pending</Badge>
                                </TableCell>
                                <TableCell className="py-1">
                                    <Link href={`/account/orders/123`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-5 h-5 text-primary" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow className="p-0">
                                <TableCell className="py-1 flex items-center gap-x-2">
                                    <Avatar>
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-1">
                                    500
                                </TableCell>
                                <TableCell className="hidden md:table-cell py-1">
                                    {format(new Date(), "dd MMMM yyyy")}
                                </TableCell>
                                <TableCell className="py-1">
                                    <Badge>Pending</Badge>
                                </TableCell>
                                <TableCell className="py-1">
                                    <Link href={`/account/orders/123`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-5 h-5 text-primary" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Wishlist />
                <Review />
            </div>
        </div>
    )
}

export default Account