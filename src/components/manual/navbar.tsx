import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import Link from "next/link"
const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  return (
    <>
      <nav className="flex justify-between items-center p-8">
        <div className="">Anonymous App</div>
        <div></div>
      </nav>
    </>
  )
}

export default Navbar
