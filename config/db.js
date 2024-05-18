import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("conected to db");
  } catch (err) {
    console.error(`error : ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
