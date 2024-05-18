import { format } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export const Orders = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>
                    Product
                </TableHead>
                <TableHead>
                    Date
                </TableHead>
                <TableHead>Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="py-1">
                        <div className="font-medium">Anis</div>
                    </TableCell>
                    <TableCell className="py-1">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="py-1">
                        {format(new Date(), "dd MMMM yyyy")}
                    </TableCell>
                    <TableCell className="py-1">450</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-1">
                        <div className="font-medium">Anis</div>
                    </TableCell>
                    <TableCell className="py-1">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="py-1">
                        {format(new Date(), "dd MMMM yyyy")}
                    </TableCell>
                    <TableCell className="py-1">450</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="py-1">
                        <div className="font-medium">Anis</div>
                    </TableCell>
                    <TableCell className="py-1">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="py-1">
                        {format(new Date(), "dd MMMM yyyy")}
                    </TableCell>
                    <TableCell className="py-1">450</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}