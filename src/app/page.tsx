"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "../data/message.json"
export default function Home() {
  const autoplay = Autoplay({ delay: 2000, stopOnInteraction: false })
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
            plugins={[autoplay]}
            opts={{
              align: "start",
            }}
            orientation="vertical"
            className="w-full max-w-md h-[200px]"
          >
            
            <CarouselContent className="-mt-1 w-md h-[200px]">
              {messages.map((message, index) => {
                return (
                  <>
                    <CardHeader>{message.title}</CardHeader>
                    <CarouselItem key={index} className="pt-1 md:basis-1/2">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex items-center justify-center p-6">
                            <span className="text-3xl font-semibold">
                              {message.message}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  </>
                )
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
      </div>
    </>
  )
}
