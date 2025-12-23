import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum: ["pending","paid","shipped","delivered"],
        required:true
    }
},
{
    timestamps: true
}
);

export const Order = mongoose.model("Order",orderSchema);