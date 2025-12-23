import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true,
        trim: true
    },
    price:{
        type:Number,
        required:true
    },
    category:[
        {
            type:String,
            required:true
        }
    ],
    stockQuantity:{
        type: Number,
        required:true
    },
    Image:{
        type:String,
        required:true
    },
    Reviews: [
      {
            
        user:{
                user:mongoose.Schema.Types.ObjectId,
                ref: "User"
        },

        rating:{
            type:Number,
            required:true,
            min:0,
            max:5
        },

        comment:{ 
            type:String,
            required: true,
            trim: true
        }
    }
    ]

},
{
    timestamps:true
}
);

export const Product = mongoose.model("Product",productSchema);