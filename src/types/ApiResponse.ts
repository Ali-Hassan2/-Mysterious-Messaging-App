import { IMessage } from "@/model"
export interface ApiResponse {
  success: string
  message: string
  isaccepting?: boolean
  messages?: Array<IMessage>
}
