import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import uploadRoutes from "./routes/dataRoutes.js";
import targetRoutes from "./routes/targetRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
const port = process.env.PORT;
connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/upload", uploadRoutes);
app.use("/target", targetRoutes);
app.use("/company", companyRoutes);
app.use("/report", reportRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
