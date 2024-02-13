import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
}));

// importing routes
import userRoutes from "./routes/userRoutes.js";

// using routes
app.use("/api/v1", userRoutes);

export default app;
