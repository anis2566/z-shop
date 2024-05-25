import { Withdraw as PrismaWithdraw } from "@prisma/client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

interface WithdrawWithSeller extends PrismaWithdraw {
    seller: {
        imageUrl: string;
    }
}

interface Props {
    withdraws: WithdrawWithSeller[]
}

export const Withdraw = ({withdraws}:Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Withdraw Requests</CardTitle>
                <CardDescription>
                    Recent withdraw request 
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>
                            Image
                        </TableHead>
                        <TableHead>
                            Amount
                        </TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            withdraws.map((withdraw) => (
                                <TableRow key={withdraw.id}>
                                    <TableCell className="py-2">
                                        <Avatar>
                                            <AvatarImage src={withdraw.seller.imageUrl} />
                                            <AvatarFallback>W</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        {withdraw.amount}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <Badge
                                            className={cn("text-white capitalize",
                                                withdraw.status === "pending" && "bg-amber-500",
                                                withdraw.status === "success" && "bg-green-500",
                                                withdraw.status === "cancelled" && "bg-rose-500",
                                            )}
                                        >{withdraw.status}
                                        </Badge>    
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}