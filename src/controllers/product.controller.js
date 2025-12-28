import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ProductsRating } from "./ai.controller.js";
import { Category } from "../models/category.model.js";

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

        if(Object.keys(req.query).length>0){

        const { page=1 , limit = 10 , search , category , minPrice , maxPrice } = req.query;

        let query = {};
        
        if(search)
            query.name = {$regex:search,$options:"i"};

        if(category){
            
            const findCategory = await Category.findOne({name:{$regex:category,$options:"i"}});
            if(!findCategory)
                return res.status(400).json({
                    success:false,
                    message:"Invalid category name"
                });

            query.category=findCategory._id;
            
        }


        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }
        
            const products = await Product.find(query)
        .skip((page-1)*limit)
        .limit(limit).populate("category");
        
    
            return res.status(200).json({
                success:true,
                message:"Filtered Products :",
                products:products
            });
        

     }

     else {
        const userId = req.user.userId;

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

    }

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
            message:"Internal Server error",
            error:error.message
        });
    }
}

const getProductsRating = async (req,res) => {
    
    try{
        
        //  ($expr) Allow aggregation expressions
        // Here we need products where reviews array size is greater than 0

        let products = await Product.find({
            $expr : {$gt: [{$size:"$reviews"},0] }
        });

        if(!products.length)
            return res.status(200).json({
                success:true,
                message:"No reviews available"
            });

        products = products.map(product=> product = {"productId":product._id,"productName":product.name,"reviews":product.reviews});

        const response = await ProductsRating(products);

        return response;

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const deleteReviewFromProduct = async (req,res) => {
    
    try{
        
        const productId = req.params.id;
        if(!productId)
            return res.status(400).json({
                success:false,
                message:"No product id in your request parameters"
            });

        const { userId } = req.body;
        if(!userId)
            return res.status(400).json({
                success:false,
                message:"No User Id in request body"
            });

        const findProduct = await Product.findOne({_id:productId});
        if(!findProduct)
            return res.status(404).json({
                success:false,
                message:"Product does not exist"
            });

        const findReview = findProduct.reviews.find(ele=> ele.user===userId);
        if(!findReview)
            return res.status(404).json({
                success:false,
                message:"This user haven't put any reviews on this product"
            });

        findProduct.reviews = findProduct.reviews.filter(ele=>ele.user.toString()!==userId);
        await findProduct.save();

        res.status(200).json({
            success:true,
            message:"Review successfully deleted",
            product:findProduct
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        })
    }
}

const addReviewToProduct = async (req,res) => {
    
    try{

        const productId = req.params.id;
        const { user , rating , comment } = req.body;

        if(!productId || !user || !rating || !comment )
            return res.status(400).json({
                success:false,
                message:"All fields are required (ProductId must be in request parameters",
            });

        const findProduct = await Product.findOne({_id:productId});
        if(!findProduct)
            return res.status(404).json({
                success:false,
                message:"Product does not exist"
            });

        const findReview = findProduct.reviews.find(ele=>ele.user.toString()===userId);
        if(findReview)
            return res.status(400).json({
                success:false,
                message:"User already put a review on this product"
            });

        findProduct.reviews.push({user,rating,comment});
        await findProduct.save();

        res.status(201).json({
            success:true,
            message:"Review added successfully",
            product:findProduct
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

export {
    createProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    insertManyProducts,
    getProductsRating,
    deleteReviewFromProduct,
    addReviewToProduct
}