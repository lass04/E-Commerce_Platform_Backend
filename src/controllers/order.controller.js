import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const createOrder = async (req,res) => {
    
    try{

    const { user, items , totalPrice , status } = req.body;

    const verify_items =  (items) => {
    items.forEach(ele=>{
        if(ele.length!==3)
            return false;
    });
    return true;
   }

   const verify_prices = async (items) => {
    items.forEach(ele=>async ()=>{
        const findProduct = await Product.findOne({product:ele.product});
        if(!findProduct) return res.status(404).json({
            success:false,
            message:`Product with id:${ele.product} does not exist`
        })
        if(findProduct.price!==ele.price) 
            return res.status(400).json({
                success:false,
                message:"Wrong price",
                real_price:findProduct.price
            });
    })
   }

   verify_prices(items);
        
    if(!user || !verify_items(items) || !totalPrice || !status )
        return res.status(400).json({
            success: false,
            message: "All fields are required (Items must contain 3 fileds product,quantity,price)"
        });

    let verifyTotal = 0;
    items.forEach(ele=>verifyTotal+=(ele.quantity*ele.price));

    if(totalPrice!==verifyTotal)
        return res.status(400).json({
            succes:false,
            message:`Wrong total Price (correct one : ${verifyTotal})`
        });

    const createOrd = await Order.create({
        user:user,
        items:items,
        totalPrice:totalPrice,
        status:status
    });

    await Cart.findByIdAndDelete(user);

    res.status(201).json({
        success:true,
        message:"Order created successfully",
        order:createOrd
    });

  }catch(error){
    return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        })
   }
}

const deleteOrder = async (req,res) => {
    
    try{

        const deleteOrd = await Order.findByIdAndDelete(req.params.id);
        if(!deleteOrd)
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        res.status(200).json({
            success: true,
            message: "Order deleted succesfully"
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const updateOrder = async (req,res) => {
    
    try{

    const id = req.params.id;

    if(Object.keys(req).length===0 || !id)
        return res.status(400).json({
    success: false,
    message: "Missing data (Id or Order fields)"
     });

     const findOrd = await Order.find({_id:id});
     if(!findOrd)
        return res.status(404).json({
    success:false,
    message: "Order not found"
    });

     const updateOrd = await Order.findByIdAndUpdate(id,req.body,{new:true});

     res.status(200).json({
        success:true,
        message:"Order updated successfully",
        order:updateOrd
     });

    }catch(error){
    return res.status(500).json({
        success:false,
        message: "Internal Server Error",
        error:error.message
    })
  }

}

const getUserOrders = async (req,res) => {

    try{

    const id = req.params.id;
    if(!id)
        return res.status(400).json({
            success: false,
            message:"User Id is missing "
        });

    let orders = await Order.find({user:id}).populate("items.product");
    if(orders.length===0)
        return res.status(200).json({
            success:true,
            message:"No Orders for this user"
        });

        // Map orders to products 
        orders = orders.flatMap(ele=>ele.items);

    res.status(200).json({
        success:true,
        message:"All User Orders :",
        orders:orders
    })

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
            error:error.message
        })
    }
}

const getOrders = async (req,res) => {
    
    try{

        const orders = await Order.find();

        if(orders.length===0)
            return res.status(200).json({
                succes:true,
                message:"No Orders in DB"
            });

        res.status(200).json({
            success:true,
            message:"All Orders : ",
            orders:orders
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const updateStatus = async (req,res) => {
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"Order Id is required"
            });

        if(Object.keys(req.body).length!==1)
            return res.status(400).json({
                success:false,
                message:"Request must contain order status only"
            });
        
        const updateStatus = await Order.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateStatus)
            return res.status(404).json({
                success:false,
                message:"No Order with this Id"
            });

        res.status(200).json({
            success:true,
            message:"Order Status successfully updated",
            order:updateStatus
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        });
    }
}

export {
    createOrder,
    deleteOrder,
    updateOrder,
    getUserOrders,
    getOrders,
    updateStatus
}