import { GoogleGenerativeAI } from "@google/generative-ai";
import * as SecureStore from 'expo-secure-store';
type GeminiOptions = {
  model:GeminiModels
}

export async function tranceHiGemini(options:GeminiOptions) {
  const key = await SecureStore.getItem('TRANCE_GEMINI_API_KEY');
  if(!key)return
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({model:options.model})

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  })
  const result = await chat.sendMessage("I have 2 dogs in my house.");
  if(result.response.text())return
  return result.response.text()
} 