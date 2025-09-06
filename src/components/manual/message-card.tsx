"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { IMessage } from "@/model"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"
import { showToast } from "@/Utils"

interface MessageCardProps {
  message: IMessage
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const confirmDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/deletemessage/${message._id}`
      )
      if (response.data.success) {
        onMessageDelete(message._id)
        showToast(response.data.message, "success")
      } else {
        const error_message =
          response.data.message || "Failed to delete message"
        showToast(error_message, "error")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiResponse>
        const err_message = err.response?.data?.message || err.message
        showToast(err_message, "error")
      } else if (error instanceof Error) {
        showToast(error.message)
      } else {
        showToast("Unknown error while deleting message.")
      }
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <X className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export { MessageCard }
