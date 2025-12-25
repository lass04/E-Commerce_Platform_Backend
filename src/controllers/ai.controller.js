import { GoogleGenAI } from "@google/genai";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import "dotenv/config";

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

export const getCartSummary = async (userId) => {

    const findCart = await Cart.findOne({user:userId}).populate("items.product");

    let prompt = `Based on a Cart in JSON format , you will make a good summary which is clear and well structured : ${JSON.stringify(findCart,null,2)}`
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  return response.text();

}

export const filterProductsByUserId = async (userId) => {
  
  const userOrders = await Order.find({user:userId});
  if(!userOrders)
    return null;

  const allProducts = await Product.find();
  const userProducts = JSON.stringify(userOrders.items,null,2);

  let prompt = `Based on the list of products (ordered by a specific user)that you get , 
  You will order all products by user preferences (and how much quantity he ordered) then return a well-formated
   and structured JSON response , this is the user data : ${userProducts} , and this is all products list : ${allProducts}`;

  const response = await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:prompt
  });

  if(!response)
    return null
  else 
    return response.text();

}
