import { InferenceClient } from "@huggingface/inference";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import "dotenv/config";



export const getCartSummary = async (cart) => {


    let prompt = `Based on a Cart in JSON format , you will make a good summary 
    which is clear and well structured (Please let the response be in JSON format remove '\n'): ${JSON.stringify(cart,null,2)}`;
  

  const client = new InferenceClient(process.env.INFERENCE_PROVIDER_KEY);

  const chatCompletion = await client.chatCompletion({

     model: "openai/gpt-oss-120b:fastest",
     messages: [
       {
        role: "user",
        content: prompt,
       }
       ]
       });

    
 return chatCompletion.choices[0].message;
 
}

export const ProductsRating = async (products) => {

  let prompt = `Based on this array : ${products} which is an array of products with reviews 
  , You will calculate ratings for every product and order these products and return A JSON format response`;

  const client = new InferenceClient(process.env.INFERENCE_PROVIDER_KEY);

  const chatCompletion = await client.chatCompletion({
    
     model: "openai/gpt-oss-120b:fastest",
     messages: [
       {
        role: "user",
        content: prompt,
       }
       ]
       });

       return chatCompletion.choices[0].message;
}