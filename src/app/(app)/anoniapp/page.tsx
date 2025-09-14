"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"

const Page = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")

  // i want the url like as it is like http://locahost:3000/anoniapp?username=ali

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
    checkUser()
  }, [username])

  if (isAuthenticated === null) return <p>Loading page....</p>
  if (isAuthenticated === false) return <p>{error}</p>

  return <div>Hello, {username}. Will continue work here.</div>
}

export default Page
