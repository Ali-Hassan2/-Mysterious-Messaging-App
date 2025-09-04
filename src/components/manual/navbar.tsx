"use client"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import Link from "next/link"
import { Button } from "../ui/button"
const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  return (
    <>
      <nav className="flex justify-between items-center p-8 shadow-b-2xl">
        <div className="">Anonymous App</div>
        <div>
          {session ? (
            <>
              <p>Welcome, {user?.username || user.email}</p>
              <Button onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button>Login</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
