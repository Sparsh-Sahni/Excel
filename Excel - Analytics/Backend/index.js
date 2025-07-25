import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import { verifyToken } from "./middleware/verifyToken.js";

// --- Route Imports ---
import authRoutes from "./routes/auth.route.js";
import filesRoutes from './routes/files.js';
import chartsRoutes from './routes/charts.js';
import usersRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
// Public route
app.use("/api/auth", authRoutes);

// Protected routes - require token verification
app.use("/api/files", verifyToken, filesRoutes);
app.use("/api/charts", verifyToken, chartsRoutes);
app.use("/api/users", verifyToken, usersRoutes);
app.use("/api/analytics", verifyToken, analyticsRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});











































// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import path from "path";

// import { connectDB } from "./db/connectDB.js";

// import authRoutes from "./routes/auth.route.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// app.use(express.json()); // allows us to parse incoming requests:req.body
// app.use(cookieParser()); // allows us to parse incoming cookies

// app.use("/api/auth", authRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// app.listen(PORT, () => {
// 	connectDB();
// 	console.log("Server is running on port: ", PORT);
// });


























































































// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import cookieParser from "cookie-parser";
// import path from "path";
// import mongoose from "mongoose";

// // --- Route Imports ---
// import authRoutes from "./routes/auth.route.js";
// import filesRoutes from './routes/files.js';
// import chartsRoutes from './routes/charts.js';
// import usersRoutes from './routes/users.js';
// import analyticsRoutes from './routes/analytics.js';

// // --- Basic Configuration ---
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// // --- Security Middleware ---
// app.use(helmet());
// app.use(compression());

// // --- Rate Limiting ---
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // Increased limit for a better user experience
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use('/api/', limiter);

// // --- CORS Configuration ---
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true
// }));

// // --- Body and Cookie Parsing Middleware ---
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // --- MongoDB Connection ---
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Connection error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // --- API Routes ---
// app.use('/api/auth', authRoutes);
// app.use('/api/files', filesRoutes);
// app.use('/api/charts', chartsRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/analytics', analyticsRoutes);

// // --- Health Check Endpoint ---
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // --- Static File Serving for Production ---
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     });
// }

// // --- 404 Not Found Handler ---
// app.use('*', (req, res) => {
//   res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
// });

// // --- Global Error Handling Middleware ---
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: 'Something went wrong!',
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//   });
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server is running on port: ${PORT}`);
// });
