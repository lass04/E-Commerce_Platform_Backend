import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { getCartSummary } from "./ai.controller.js";
import { User } from "../models/user.model.js";

const createCart = async (req,res) => {

    try{

    let items = [];
    let totalPrice = 0;
    const user = req.user.userId;

    const findUser = await User.findOne({_id:user});
    if(!findUser)
        return res.status(400).json({
            succes:false,
            message:"User Id is missing"
        });

    const findCart = await Cart.findOne({user:user});
        if(findCart)
            return res.status(400).json({
                success:false,
        message:"Cart already exist (One cart for every user)"
            });


    const createCart = await Cart.create({
        user:user,
        items:items,
        totalPrice:totalPrice
    });

    res.status(201).json({
        success:true,
        message:"Cart successfully created",
        cart:createCart
    });

 }catch(error){
    return res.status(500).json({
        succes:false,
        message:"Internal Server Error",
        error:error.message
    });
 }

}

const addProductToCart = async (req,res) => {

    try{
    
        const { productId , quantity } = req.body;
        const userId = req.user.userId;

        if(!productId || !quantity || !userId)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

            const findProduct = await Product.findById(productId);
            if(!findProduct)
                return res.status(404).json({
                    success:false,
                    message:"Product Not Found"
                });

        const findCart = await Cart.findOne({user:userId});
        if(!findCart)
            return res.status(404).json({
                success:false,
                message:"Cart Not Found"
            });

            let existingProduct = findCart.items.find(ele => ele.product.toString()===productId);
            
            if(existingProduct){
                existingProduct.quantity+=quantity;
            }else{
        findCart.items.push({
            product: productId,
            quantity,
            price:findProduct.price
        });
        }

        await findCart.save();

        res.status(200).json({
            success:true,
            message:"Product added to Cart Successfully ",
            Cart:findCart
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message 
        });
    }
}

const updateProductQuantity = async (req,res) => {
    
    try{

        const { productId , quantity } = req.body;
        const userId = req.user.userId;


        if(!productId || quantity===undefined || !userId)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findCart = await Cart.findOne({user:userId});
        if(!findCart)
            return res.status(404).json({
                success:false,
                message:"Cart Not found"
            });

        const findProduct = await Product.findById(productId);
        if(!findProduct)
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            });

        const productExistInCart = findCart.items.find(ele=>ele.product.toString()===productId);
        if(!productExistInCart)
            return res.status(404).json({
                success:false,
                message:"Product Does not belong to Cart"
            });
        else {
            productExistInCart.quantity = quantity;
        }

        await findCart.save();

        res.status(200).json({
            success:true,
            message:"Product Quantity Updated successfully",
            Cart:findCart
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Server Internal Error",
            error:error.message
        })
    }
}

const removeProductFromCart = async (req,res) => {
   
    try{

        const productId =req.params.id

        const userId = req.user.userId;

        if(!productId || !userId)
            return res.status(400).json({
                success:false,
                message:" Missing ProductId or Cart UserId (or both)"
            });

        const findCart = await Cart.findOne({user:userId});
        if(!findCart)
            return res.status(404).json({
                success:false,
                message:"Cart Not found"
            });


            const productExistInCart = findCart.items.find(ele=>ele.product.toString()===productId);
        if(!productExistInCart)
            return res.status(404).json({
                success:false,
                message:"Product Does not belong to Cart"
            });
        else {
            findCart.items = findCart.items.filter(ele=>ele.product.toString()!==productId);
        }

        await findCart.save();

        res.status(200).json({
            success:true,
            message:"Product removed successfully from Cart"
        });

    }catch(error){
         return res.status(500).json({
            success:false,
            message:"Server Internal Error",
            error:error.message
        })
    }
}

const viewCartSummary = async (req,res) => {

    try{
    
        const userId = req.params.id;

    if(!userId)
        return res.status(400).json({
            success:false,
            message:"No UserId in request"
        });

        const findCart = await Cart.findOne({user:userId});
        if(!findCart)
            return res.status(404).json({
                success:false,
                message:"Cart does not exist"
            });

        const summary = await getCartSummary(findCart);
    
        res.status(200).json({
            success:true,
            message:"Cart Summary : ",
            summary:summary
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Server Internal Error",
            error:error.message
        })
    }
}

export {
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    viewCartSummary,
    createCart
}