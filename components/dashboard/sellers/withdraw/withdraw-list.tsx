"use client"

import { Withdraw } from "@prisma/client"
import { Edit } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Header } from "./header"
import { cn } from "@/lib/utils"
import { PaginationComp } from "@/components/pagination-comp"
import { useWithdrawApprove } from "@/store/use-withdraw"


interface WithdrawWithSeller extends Withdraw {
    seller: {
        name: string;
        imageUrl: string;
    }
}

interface Props {
    withdraws: WithdrawWithSeller[];
    totalPage: number
}

export const WithdrawList = ({ withdraws, totalPage }: Props) => {
    const { onOpen } = useWithdrawApprove()
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Withdraw List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Image</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Amount</TableHead>
                        <TableHead className="">Method</TableHead>
                        <TableHead className="">Number</TableHead>
                        <TableHead className="">Status</TableHead>
                        <TableHead className="">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            withdraws.map(withdraw => (
                            <TableRow key={withdraw.id}>
                                <TableCell className="py-2">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={withdraw.seller.imageUrl} />
                                        <AvatarFallback>{withdraw.seller.name}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-2">{withdraw.seller.name}</TableCell>
                                <TableCell className="py-2">{withdraw.amount}</TableCell>
                                <TableCell className="py-2 capitalize">{withdraw.method}</TableCell>
                                <TableCell className="py-2">{withdraw.number}</TableCell>
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
                                    <TableCell className="py-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => onOpen(withdraw.id)}>
                                                        <Edit className="h-5 w-5" />
                                                    </Button>   
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                <p>Change Status</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                </TableCell>
                            </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <PaginationComp totalPage={totalPage} />
            </CardContent>
        </Card>
    )
}