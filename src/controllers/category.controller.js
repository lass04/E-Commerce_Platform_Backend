import { Category } from "../models/category.model.js";


const createCategory = async (req,res) => {
    
    try{

    const { name , description } = req.body;

    if(!name || !description)
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        });

    const findCategory = await Category.findOne({name:name});
    if(findCategory)
         return res.status(400).json({
            success:false,
            message:"Category already exist"
        });

    const createCategory = await Category.create({
        name:name,
        description:description
    });
    
    res.status(201).json({
        success:true,
        message:"Category successfully created ",
        category:createCategory
    });

  }catch(error){
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });
  }
}

const deleteCategory = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Data (missing category id in request)"
        });

        const deleteCategory = await Category.findByIdAndDelete(id);
        if(!deleteCategory)
            return res.status(404).json({
                success:false,
                message:"Category does not exist"
            });

        res.status(200).json({
            success:true,
            message:"Category deleted successfully"
        });


    }catch(error){
         return res.status(500).json({
        success:false,
        message:"Internal Server Error",
         error:error.message
    });
    }
}

const updateCategory = async (req,res) => {
    
    try{
        
    const id = req.params.id;
    if(!id)
            return res.status(400).json({
                success:false,
                message:"No Data (missing category id in request)"
        });

    if(Object.keys(req.body).length===0)
        return res.status(400).json({
            success:false,
            message:"No data provided"
        });

    const updateCategory = await Category.findByIdAndDelete({_id:id});

    if(!updateCategory)
        return res.status(404).json({
            success:false,
            message:"Category does not exist"
        });

    res.status(200).json({
        success:true,
        message:"Category updated successfully",
        category:updateCategory
    });

    }catch(error){
        return res.status(500).json({
        success:false,
        message:"Internal Server Error",
         error:error.message
    });
    }
}

const getCategories = async (req,res) => {

    try{
    
        const categories = await Category.find();
        
        if(categories.length===0)
            return res.status(200).json({
                success:true,
                message:"No Categories available"
            });

        res.status(200).json({
            success:true,
            message:"All Categories :",
            categories:categories
        });

    }catch(error){
        return res.status(500).json({
        success:false,
        message:"Internal Server Error",
         error:error.message
    });
    }
}

const insertManyCategories = async (req,res) => {
    try{

        const categories = req.body;
        if(!categories.length)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });


            await Category.insertMany(categories);
            res.status(200).json({
                success:true,
                message:"Inserted successfully"
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
    createCategory,
    deleteCategory,
    updateCategory,
    getCategories,
    insertManyCategories
}