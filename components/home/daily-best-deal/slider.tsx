"use client"

import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { ProductWithFeature } from "@/@types";
import { BeastDealCardSkeleton, BestDealCard } from "@/components/home/card/best-deal-card";

interface Props {
    products: ProductWithFeature[];
    isFetching: boolean;
}

export const Slider = ({ products, isFetching }: Props) => {
    
    return (
        <Carousel
            opts={{
                align: "center",
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]}
            className="w-full max-w-[1400px]"
        >
            <CarouselContent className="-ml-2 md:-ml-4">
                {
                    isFetching ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/4 lg:basis-1/5">
                                <BeastDealCardSkeleton />
                            </CarouselItem>
                        ))
                    ) :
                    products.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/1 sm:basis-1/2 md:basis-1/4 lg:basis-1/5">
                            <BestDealCard product={product} />
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
            <CarouselPrevious className="-left-3 top-[50%]" />
            <CarouselNext className="-right-3 top-[50%]" />
        </Carousel>
    )
}