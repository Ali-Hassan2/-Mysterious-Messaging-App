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
import axios from "axios"

interface MessageCardProps {
  message: IMessage
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const confirmDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/deletemessage/${message._id}`
    )
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
