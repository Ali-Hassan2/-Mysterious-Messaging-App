"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { messageSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { showToast } from "@/Utils"
import { ApiResponse } from "@/types"
const Page = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [messageStatus, setMessageStatus] = useState(false)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [error, setError] = useState<string>("")

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const checkUser = async () => {
    setIsAuthenticated(false)
    setError("")
    try {
      console.log("The username is:", username)

      const response = await axios.get(`/api/getuser?username=${username}`)
      const data = response?.data

      if (!data.success) {
        setIsAuthenticated(false)
        setError("No page associated with this  username")
        return
      }
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setError("Something went wrong")
    }
  }
  useEffect(() => {
    if (username) {
      setCurrentUsername(username)
    }
    checkUser()
  }, [username])

  if (!username) return <p>Loading username...</p>

  console.log("The usernameeeeeeeeeeee is:", username)
  console.log("The usernameeeeeeeeeeee issss:", currentUsername)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    console.log("The message is:", data.content)
    setMessageStatus(true)

    try {
      const payload = {
        ...data,
        username: currentUsername,
      }
      console.log("The username is:", currentUsername)
      const response = await axios.post<ApiResponse>(
        "/api/sendmessages",
        payload
      )
      console.log("The data is:", response)

      const message = response.data
      if (message.success) {
        showToast("Message sent successfully", "success")
        form.reset()
      } else {
        showToast(message.message || "Cannot send the message", "error")
      }
    } catch (error) {
      console.log("There is an error", error)
      showToast("An unexpected error occurred.", "error")
    } finally {
      setMessageStatus(false)
    }
  }
  if (isAuthenticated === null) return <p>Loading page....</p>
  if (isAuthenticated === false) return <p>{error}</p>

  return (
    <div>
      <section className="upper">
        Hello Bro we will send your message to {username}
      </section>
      <section className="mid">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Message Here</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your message here..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <Button type="submit" disabled={messageStatus}>
              {messageStatus ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending
                </>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

export default Page
