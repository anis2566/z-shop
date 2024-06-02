import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export const OrderSkeleton = ({limit}:{limit:number}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Explore your lates orders</CardDescription>
            </CardHeader>
            <CardContent>
                <Table> 
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Products</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            Array.from({ length: limit}, (_, i) => (
                                <TableRow className="p-0" key={i}>
                                    <TableCell className="py-1 flex justify-center gap-x-2">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
                                    </TableCell>
                                    <TableCell className="py-1">
                                        <Skeleton className="h-7 w-full" />
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