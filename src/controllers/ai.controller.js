import { GoogleGenAI } from "@google/genai";

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
  
  return response.output_text

}
