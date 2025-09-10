import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-react"

export default function Home() {
  return (
    <>
      <div className="font-sans flex flex-col items-center min-h-screen pb-20 gap-16 border-2 border-red-700">
        <div className="upperSection flex items-center justify-center flex-col w-screen h-[20vh] border-4 border-green-800">
          <h1 className="text-4xl font-bold   ">Welcome, to alios</h1>
          <p className="text-1xl mt-2  ">
            See who want to text you and what they think about you
          </p>
        </div>
        <main>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            opts={{
              align: "start",
            }}
            orientation="vertical"
            className="w-full max-w-xs"
          >
            <CarouselContent className="-mt-1 h-[200px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
              {/* Courousal  autoply is pedning to fix */}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
      </div>
    </>
  )
}
