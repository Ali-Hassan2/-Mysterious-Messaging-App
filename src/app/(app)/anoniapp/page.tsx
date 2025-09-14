"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { messageSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const Page = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [messageStatus, setMessageStatus] = useState(false)
  const [error, setError] = useState<string>("")

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
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

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {}

  useEffect(() => {
    checkUser()
  }, [username])

  if (isAuthenticated === null) return <p>Loading page....</p>
  if (isAuthenticated === false) return <p>{error}</p>

  return (
    <div>
      <section className="upper">
        Hello Bro we will send your message to {username}
      </section>
      <section className="mid">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              name="email"
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
          </form>
        </Form>
      </section>
    </div>
  )
}

export default Page
