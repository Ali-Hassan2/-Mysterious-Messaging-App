import mongoose, { Schema, Document } from "mongoose";
import { IMessage, MessageSchema } from "./Messages.model";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code expiry is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
      
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export { UserModel };
