"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

interface Props {
    totalPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ReviewPagination = ({ totalPage, setCurrentPage, currentPage }: Props) => {

    const handleNext = () => {
        setCurrentPage(prev => prev + 1)
    }

    const handlePrev = () => {
        setCurrentPage(prev => prev - 1)
    }
    
    return (
        <Pagination className="pt-5">
            <PaginationContent>
                <Button variant="ghost" className="flex items-center gap-x-2" onClick={handlePrev} disabled={currentPage <= 1}>
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </Button>
                <div className="hidden md:flex">
                    {
                        Array.from({ length: totalPage }, (_, i) => (
                            <PaginationItem key={i}>
                                <Button variant="ghost" size="icon" onClick={() => setCurrentPage(i+1)} disabled={currentPage === i + 1}>
                                    {i + 1}
                                </Button>
                            </PaginationItem>
                        ))
                    }
                </div>
                <Button variant="ghost" className="flex items-center gap-x-2" onClick={handleNext} disabled={currentPage >= totalPage}>
                    Next
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </PaginationContent>
        </Pagination>
    )
}