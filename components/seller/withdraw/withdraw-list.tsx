import { format } from "date-fns"
import { Withdraw } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Header } from "./header"
import { cn } from "@/lib/utils"
import { PaginationComp } from "@/components/pagination-comp"

interface Props {
    withdraws: Withdraw[];
    totalPage: number;
}

export const WithdrawList = ({withdraws, totalPage}:Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Withdraw History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-[300px] sm:w-full">
                <Header />
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="">Date</TableHead>
                        <TableHead className="">Amount</TableHead>
                        <TableHead className="">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            withdraws.map(withdraw => (
                            <TableRow key={withdraw.id}>
                                <TableCell className="py-2">{format(withdraw.createdAt, "dd MMMM yyyy")}</TableCell>
                                <TableCell className="py-2">{withdraw.amount}</TableCell>
                                    <TableCell className="py-2">
                                        <Badge
                                            className={cn("capitalize",
                                                withdraw.status === "pending" && "bg-amber-500",
                                                withdraw.status === "success" && "bg-green-500",
                                                withdraw.status === "cancelled" && "bg-rose-500",
                                            )}
                                        >
                                            {withdraw.status}
                                        </Badge>
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