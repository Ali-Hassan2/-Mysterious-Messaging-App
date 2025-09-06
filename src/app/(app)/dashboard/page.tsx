"use client"
import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptingSchema } from "@/schemas"
import { IMessage } from "@/model"

const page = () => {
  const [messages, setMessages] = useState < IMessage > []([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)

  const handleDeleteMessagesFromUi = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const form = useForm({
    resolver: zodResolver(acceptingSchema),
  })
  const {watch,register}
  return (
    <>
      <div className="w-full h-[90vh] border-4 border-red-600">
        <div className="upper h-[100px] border-4 border-blue-600 text-[2vw] font-bold pl-3">
          User Dashboard
        </div>
        <div className="h-[300px] border-2 border-green-400 flex items-center justify-center">
          <div className="left w-[50vw] border-4 border-red-700 h-full flex justify-items-start pl-[50px] text-4xl font-bold items-center">
            Your Messages
          </div>
          <div className="right w-[50vw] h-full flex justify-center items-center">
            <div className="box h-[4vw] w-[20vw] bg-white/40 p-2 flex items-center justify-between">
              Your Messages
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
