"use client"

import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function Banner() {
    return (
        <Carousel
            className="w-full max-w-[1450px] mx-auto mt-5 max-h-[400px]"
            plugins={[
                Autoplay({
                delay: 5000,
                }),
            ]}
        >
            <CarouselContent>
                <CarouselItem>
                    <Image
                        src="/banner1.jpg"
                        alt="Banner"
                        width={1000}
                        height={1000}
                        className="w-full h-full max-h-[400px]"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                        src="/banner2.jpg"
                        alt="Banner"
                        width={1000}
                        height={1000}
                        className="w-full h-full max-h-[400px]"
                    />
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}