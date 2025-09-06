"use client"
import { useCallback, useEffect, useState } from "react"
import * as z from "zod"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptingSchema } from "@/schemas"
import { IMessage } from "@/model"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"
import { showToast } from "@/Utils"

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
  const { data: session } = useSession()
  const { watch, register, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/acceptingmessages")
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      if (axios.AxiosError(error)) {
        const err = error as AxiosError<ApiResponse>
        const error_message = err.response?.data?.message || err.message
        const toast_error_message =
          error_message || "Failed to Get Message Settings."
        showToast(toast_error_message, "error")
      } else if (error instanceof Error) {
        console.log(error.message)
        showToast(error?.message, "error")
      } else {
        showToast("Some Unexpected error occured.", "error  ")
      }
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async ({ refresh: boolean = false }) => {
      setIsLoading(true)
      const controller = new AbortController()
      const signal = controller.signal
      const timer = 4000
      const timeout = setTimeout(() => {
        controller.abort()
      }, timer)
      try {
        const response = await axios.get<ApiResponse>("/api/getmessages")
        clearTimeout(timeout)
        if (!response.ok) {
          const error_Data = await response.json().catch(() => null)
          throw new Error(error_Data?.message || "Cannot get messages")
        }
        const messagesFetched = await response.json()
        if (Array.isArray(messagesFetched)) {
          setMessages(messagesFetched || [])
        }
      } catch (error) {
        if (axios.AxiosError(error)) {
          const err = error as AxiosError<ApiResponse>
          const error_message = err.response?.data?.message || err.message
          const error_for_toast = error_message || "Failed to get Messages."
          showToast(error_for_toast, "error")
        } else if (error instanceof AxiosError) {
          showToast(error?.message)
        } else {
          showToast("Unexpected error occured.")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLoading, setMessages]
  )

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptingMessages()
  }, [session, setValue, fetchAcceptingMessages, fetchMessages])

  const handleSwitchChange = async()=>{
    
  }

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
