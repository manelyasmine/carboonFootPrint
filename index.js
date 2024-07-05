import express from "express";

//import errorHandler from '../middlewares/errorHandler';

//import errorHandler from '../middlewares/errorHandler';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import uploadRoutes from "./routes/dataRoutes.js";
import targetRoutes from "./routes/targetRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import emissionRoutes from "./routes/emissionRoutes.js";
import notificatioRoutes from "./routes/notifcationRoutes.js"
import notificationsettings from "./routes/notifcationSettingsRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";


import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT;
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true,
  })
);

//setting up Socket io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// export const io = new Server(server);
// app.get('/socket.io', (req, res) => {
//   res.send('<h1>Hello world socket io</h1>');
// });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/api/notify", (req, res) => {
  // Emit a notification event to all connected clients
  io.emit("notification", { message: "API was called!" });
  res.status(200).send("Notification sent");
});

// routes for apis

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/api/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/data", uploadRoutes);
app.use("/target", targetRoutes);
app.use("/company", companyRoutes);
app.use("/report", reportRoutes);
app.use("/role", roleRoutes);
app.use("/emission", emissionRoutes);
app.use("/notification", notificatioRoutes);
app.use("/notification-settings", notificationsettings);

//app.use(errorHandler);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

export { io };
