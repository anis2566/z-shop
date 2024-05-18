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

export const Withdraw = () => {
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
                            Name
                        </TableHead>
                        <TableHead>
                            Amount
                        </TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="py-2">
                                <div className="font-medium">Anis</div>
                            </TableCell>
                            <TableCell className="py-2">
                                1400
                            </TableCell>
                            <TableCell className="py-2">
                                <Badge>Pending</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="py-2">
                                <div className="font-medium">Anis</div>
                            </TableCell>
                            <TableCell className="py-2">
                                1400
                            </TableCell>
                            <TableCell className="py-2">
                                <Badge>Pending</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="py-1">
                                <div className="font-medium">Anis</div>
                            </TableCell>
                            <TableCell className="py-1">
                                1400
                            </TableCell>
                            <TableCell className="py-1">
                                <Badge>Pending</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}