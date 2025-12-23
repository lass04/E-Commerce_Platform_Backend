import jwt from "jsonwebtoken";


export const createAccessToken = (user) => {
    jwt.sign(
        {userId:user._id, role: user.role},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m"}
    );
}

export const createRefreshToken = (user) => {
    jwt.sign(
        {userId:user._id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d"}
    );
}