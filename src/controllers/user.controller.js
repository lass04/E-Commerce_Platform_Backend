import { User } from "../models/user.model.js";
import { createRefreshToken , createAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

const createUser = async (req,res) => {

    try{

    const { nom, prenom, password, email, phoneNumber, role } = req.body;

    if(!nom || !prenom || !password || !email || !phoneNumber || !role )
        return res.status(400).json({
            success:false,
            message: "All fields are required"
        });

    const findUser = await User.findOne({email:email});
    if(findUser)
        return res.status(400).json({
     success:false,
     message: "User already exists"
    });

    const createUser = await User.create({
        nom:nom,
        prenom:prenom,
        password:password,
        email:email,
        phoneNumber:phoneNumber,
        role:role
    });

    res.status(201).json({
        success: true,
        message: "User successfully created",
        createUser
    });

    }catch(error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const updateUser = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No parameters in your request"
            });

        if(Object.keys(req).length===0)
                    return res.status(400).json({
                      message: "No data provided"});
        
                const updateUser = await User.findByIdAndUpdate(id,req.body,{new:true});
                if(!updateUser)
                    return res.status(404).json({message: "User not found"});
        
        
                res.status(200).json({
                    success:true,
                    message:"User updated successfully",
                    updateUser
                });
                
    }catch(error){
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const deleteUser = async (req,res) => {

        try{

            const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No parameters in your request"
            });
        
                const deleteUser = await User.findByIdAndDelete(id);
                if(!deleteUser)
                    return res.status(404).json({message: "User Not found"});
        
            
                res.status(200).json({
                    success:true,
                    message:"User deleted successfully"
                });
                
    }catch(error){
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const getUsers = async (req,res) => {
    
    try{
        const users = await User.find();
        if(!users)
            return res.status(400).json({
        message:"Cannot get users"
    });

    res.status(200).json({
        success:true,
        message: "All Users",
        users
    });

    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.messsage
        })
    }
}

const loginUser = async (req,res) => {

    const { email, password } = req.body;

    if(!email || ! password)
        return res.status(400).json({
    success:false,
    message:"Credentials required"
     });

     const findUser = await User.findOne({email:email});
     if(!findUser)
        return res.status(401).json({
    success:false,
    message: "Invalid Credentials"
 });

    const match = await findUser.comparePasswords(password);
    if(!match)
        return res.status(401).json({
    success:false,
    message: "Invalid Credentials"
 });

 const accessToken = createAccessToken(findUser);
 const refreshToken = createRefreshToken(findUser);

  res.cookie("refreshToken",refreshToken,{
    httpOnly: true,
    sameSite: "strict"
  });

  res.status(200).json({
        success:true,
        message:"Access Token",
        accessToken:accessToken
    })
}

const refreshUserToken = async (req,res) => {
    
    const token = req.cookies.refreshToken;
    if(!token)
        return res.status(403).json({
        success:false,
        message: "No Token"
        });

    const findUser = await User.find({refreshToken:token});
    if(!findUser)
        return res.status(401).json({
        success:false,
        message: "User not found"
        });

    try{
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    }catch(error){
        return res.status(403).json({
        success:false,
        message: "Invalid Token"
        });
    }

    const accessToken = createAccessToken(findUser);
    res.status(200).json({
        success:true,
        message:"Refreshed Access Token",
        accessToken:accessToken
    })
}

const logoutUser = async (req,res) => {

    const token = req.cookies.refreshToken;
    if(!token)
        return res.status(403).json({
        success:false,
        message: "No Token"
        });

    const logout = await User.updateOne(
        { refreshToken: token },
        { $unset : { refreshToken: "" }}
    );

    if(!logout)
        return res.status(500).json({
        success: false,
        message: "Failed to Lougout"
    });

    res.status(200).json({
        success: true,
        message: "User Logged Out successfully"
    });
}

export {
    createUser,
    deleteUser,
    updateUser,
    getUsers,
    loginUser,
    logoutUser,
    refreshUserToken
}