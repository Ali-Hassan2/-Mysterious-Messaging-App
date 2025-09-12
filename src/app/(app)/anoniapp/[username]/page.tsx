import axios from "axios"
import { notFound } from "next/navigation"
interface Props {
  params: { username: string }
}
const page = ({ params }: Props) => {
  const { username } = params
  const checkUser = async () => {
    const user = await axios.get(`/api/getuser?username=${username}`)
    
  }
}

export default page
