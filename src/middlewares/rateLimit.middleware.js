import rateLimit from "express-rate-limit";


export const rateLimiter = new rateLimit({
    WindowMs: 1000 * 60 * 15,
    max : 100,
    message: "Too Many requests"
});

