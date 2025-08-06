import express from 'express';
import dotenv from 'dotenv';
import blog from './routes/blog.js';
import user from './routes/user.js';
import dbConnect from './config/database.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
// Mount routes
app.use("/api/v1", blog);
app.use("/api/user", user);

// Connect to DB
dbConnect();

// Start Server
app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});

// Default Route
app.get('/', (req, res) => {
    res.send(`<h1>HomePage</h1>`);
});
