"use client"
import { use, useEffect, useState } from "react"
import axios from "axios"

interface Props {
  params: Promise<{ username: string }>
}

const Page = ({ params }: Props) => {
  // unwrap params (Next.js 15 way)
  const { username } = use(params)

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")

  const checkUser = async () => {
    setIsAuthenticated(false)
    setError("")
    try {
      console.log("The username is:", username)

      const response = await axios.get(`/api/getuser?username=${username}`)
      const data = response?.data
      console.log("The data is:", data)

      if (!data.success) {
        setIsAuthenticated(false)
        setError("No page associated with this username")
        return
      }
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setError("Something went wrong")
    }
  }

  useEffect(() => {
    checkUser()
  }, [username])

  if (isAuthenticated === null) return <p>Loading page....</p>
  if (isAuthenticated === false) return <p>{error}</p>

  return <div>Hello, {username}. Will continue work here.</div>
}

export default Page
