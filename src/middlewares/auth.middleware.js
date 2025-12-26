import jwt from "jsonwebtoken";

const verifyToken = function (req) {
    
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith("Bearer"))
        return null

    const token = auth.split(" ")[1];

    try{
        return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
    }catch{
        return null
    }
}

const adminOnly = async (req,res,next) => {

    const user = verifyToken(req);

    if(user===null)
        return res.status(403).json({
            success:false,
            message:"Invalid Token"
        });


    if(user.role!=="admin")
        return res.status(403).json({
            success:false,
            message:"Admin priviliges needed !"
        });
 
        req.user = user;
        next();
    
}

const authenticate = async (req,res,next) => {

    const user = verifyToken(req);

    if(!user)
        return res.status(403).json({
            success:false,
            message:"Invalid Token"
        });

    req.user = user;
    next();

}

export { 
    adminOnly,
    authenticate
}