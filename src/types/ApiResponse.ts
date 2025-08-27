import { IMessage } from "@/model";
interface ApiResponse {
  success: string;
  message: string;
  isaccepting?: boolean;
  messages?: Array<IMessage>;
}


