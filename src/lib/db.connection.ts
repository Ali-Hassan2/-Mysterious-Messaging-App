import mongoose from "mongoose";

type connectionobject = {
  isconnected?: number;
};

const connection: connectionobject = {};

const connect_db: Promise<void> = async () => {
  if (connection.isconnected) {
    console.log("DB already connected");
    return;
  }
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log("There is no mongodb uri provided.");
      process.exit(1);
    }
    const db = await mongoose.connect(uri);
    connection.isconnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("There is an error,", error);
    process.exit(1);
  }
};

export { connect_db };
