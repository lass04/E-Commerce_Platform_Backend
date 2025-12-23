import express from "express";

const app = express();

// Request Parsing Middleware
app.use(express.json());

export default app;