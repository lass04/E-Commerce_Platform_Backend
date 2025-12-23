import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    nom:{
        type:String,
        required:true,
        maxlength: 15,
        minlength: 5,
    },
    prenom:{
        type:String,
        required:true,
        maxlength: 15,
        minlength: 5,
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type:String,
        required: true,
        minlength:8,
        maxlength:8
    },
    role:{
        type:String,
        default: "user"
    }
},
{
    timestamps: true
}
);

userSchema.pre("save",async ()=>{
    if(!this.isModified("password"))
        return 
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePasswords = async (password) => {
    return await bcrypt.compare(password,this.password);
}

export const User = mongoose.model("User",userSchema);