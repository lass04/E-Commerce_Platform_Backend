import rateLimit from "express-rate-limit";


export const rateLimiter = rateLimit({
    WindowMs: 1000 * 60 * 15,
    max : 100,
    message: { message: "Too Many requests"}
});

