"use client"
import { useCallback, useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import * as z from "zod"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptingSchema } from "@/schemas"
import { IMessage } from "@/model"
import { ApiResponse } from "@/types"
import { showToast } from "@/Utils"
import { User } from "next-auth"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { MessageCard } from "@/components/manual/message-card"
import { Check, Copy } from "lucide-react"

const page = () => {

  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
  const [copy, setcopy] = useState<boolean>(false)

  const handleDeleteMessagesFromUi = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  // TODO:check warnings and lint plans
  const form = useForm<z.infer<typeof acceptingSchema>>({
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
      console.log(response.data.isAcceptingMessages)
    } catch (error) {
      if (axios.isAxiosError(error)) {
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

  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    const controller = new AbortController()
    const signal = controller.signal
    const timer = 4000
    const timeout = setTimeout(() => {
      controller.abort()
    }, timer)
    try {
      const response = await axios.get<ApiResponse>("/api/getmessages", {
        signal: signal,
      })
      console.log(response)
      console.log("Mei nhi chl pa rha hu yar ali")
      clearTimeout(timeout)
      console.log("The respoonse is:", response.data)
      const messagesFetched = await response.data.messages
      console.log("The messages ", messagesFetched)
      if (Array.isArray(messagesFetched)) {
        setMessages(messagesFetched || [])
      } else {
        throw new Error("Invalid response format.")
      }
    } catch (error) {
      clearTimeout(timeout)
      if (axios.isAxiosError(error)) {
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
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    console.log("Mei tw chl rha hu ")
    fetchMessages()
    fetchAcceptingMessages()
  }, [session, setValue, fetchAcceptingMessages, fetchMessages])

  const handleSwitchChange = async (checked: boolean) => {
    try {
      const response = await axios.post<ApiResponse>("/api/acceptingmessages", {
        acceptMessages: checked,
      })

      if (response.data.success) {
        setValue("acceptMessages", checked)
        showToast(
          `Accepting Messages turned ${checked ? "ON" : "OFF"}`,
          "success"
        )
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "Failed to Change status",
          "error"
        )
      }
    }
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  const { username } = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/test/${username}`

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl)
    setcopy(true)
    showToast("Link Copied", "success")
    setTimeout(() => {
      setcopy(false)
    }, 2000)
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
            <div className="box h-[4vw] w-[20vw] bg-white/40 p-2  items-center justify-between border-2 flex">
              <div className=" flex-1 border-3 border-red-700 h-full ">
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={(checked) => handleSwitchChange(checked)}
                  disabled={isSwitchLoading}
                />
                <span className="flex-1">
                  Accepting Messages: {acceptMessages ? "on" : "off"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[100px] w-full border-1 border-blue-700">
          <div className="border-1 border-black flex justify-items-start items-center gap-[10px]">
            Your Profile Link is: {profileUrl}{" "}
            {copy ? (
              <>
                <Check /> Copied
              </>
            ) : (
              <Copy onClick={copyToClipBoard} className="cursor-pointer" />
            )}
          </div>
        </div>
        <Separator />
        <div className="h-[500px] w-full border-3 border-red-700">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <MessageCard
                key={msg._id}
                message={msg}
                onMessageDelete={handleDeleteMessagesFromUi}
              />
            ))
          ) : (
            <p>No messages found</p>
          )}
        </div>
        <Separator />
      </div>
    </>
  )
}

export default page
