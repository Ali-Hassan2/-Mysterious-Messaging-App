"use client"

import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import Link from "next/link"
import { Button } from "../ui/button"

const Navbar = () => {
  const { data: session } = useSession()
  console.log("The session is:", data)
  const user: User = session?.user as User

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white dark:bg-neutral-900 shadow-md">
      <div className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">
        Anonymous App
      </div>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <p className="text-gray-700 dark:text-gray-200">
              Welcome,&nbsp;
              <span className="font-semibold">
                {user?.username || user.email}
              </span>
            </p>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="rounded-xl shadow-sm"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/signin">
            <Button className="rounded-xl shadow-sm">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
