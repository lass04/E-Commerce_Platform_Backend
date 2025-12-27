import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";


const createProduct = async (req,res) => {

    try{
        const { name, description , price , category , stockQuantity , image } = req.body;

        if( !name || !description || !price || category.length===0 || stockQuantity===undefined || !image)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findProduct = await Product.findOne({name:name});
        if(findProduct)
            return res.status(400).json({
                success:false,
                message:"Product already exist"
            });

        const createPrd = await Product.create({
            name:name,
            description:description,
            price:price,
            category:category,
            stockQuantity:stockQuantity,
            image:image
        });

        res.status(201).json({
            success:true,
            message: "Product successfully created",
            product:createPrd
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
             error:error.message
        });
    }
}

const deleteProduct = async (req,res) => {

    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No parameters in your request"
            });

    
        const deletePrd = await Product.findByIdAndDelete(id);
        if(!deletePrd)
            return res.status(404).json({
                success:false,
                message:"Product does not exist"
            });

        res.status(200).json({
            success:true,
            message:"Product successfully deleted"
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
             error:error.message
        });
    }
}

const updateProduct = async (req,res) => {
    try{
        
        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No parameters in your request"
            });

        if(Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        const updateProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});

        if(!updateProduct)
            return res.status(404).json({
                success:false,
                message:"Product does not exist"
            });

        res.status(200).json({
            success:true,
            message:"Product successfully updated",
            product:updateProduct
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
             error:error.message
        });
    }
}

const getProducts = async (req,res) => {

    try{

        const { page=1 , limit = 10 , search , category , minPrice , maxPrice } = req.query;

        let query = {};
        
        if(search)
            query.name = {$regex:search,$options:"i"};

        if(category)
            query.category = category

        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }

        if(Object.keys(query).length>0){
        
            const products = await Product.find(query)
        .skip((page-1)*limit)
        .limit(limit);
    
            return res.status(200).json({
                success:true,
                message:"Filtered Products :",
                products:products
            });
        }

        const userId = req.user._id;

        if(!userId){
            const products = await Product.find();
            return res.status(200).json({
                success:true,
                message:"All Products : ",
                products:products
            });
        }

        const userOrders = await Order.find({user:userId}).populate("items.product");

        if(userOrders.length===0){
            const products = await Product.find();
            return res.status(200).json({
                success:true,
                message:"No Orders from that user",
                products:products
            });
        }

        let userProducts = userOrders.flatMap(order => order.items.map(item=>item.product));

        res.status(200).json({
            success:true,
            message:"Products filtered by user preferences :",
            products:userProducts
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Internal Server Error",
             error:error.message
        });
    }
}

const insertManyProducts = async (req,res) => {
    
    try{

        const products = req.body
        if(Object.keys(products).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        products.forEach(product => async ()=>{
            const findProduct = await Product.find({_id:product._id});
            if(findProduct)
                return res.status(400).json({
                    success:false,
                    message:"Product already exists in DB :",
                    product:findProduct
                });
        });

        const insertProducts = await Product.insertMany(products);

        res.status(201).json({
            success:true,
            message:"Inserted successfully"
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        });
    }
}

export {
    createProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    insertManyProducts
}