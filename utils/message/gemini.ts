import { GoogleGenerativeAI } from '@google/generative-ai';
import * as SecureStore from 'expo-secure-store';
import { readCharacterById } from '../db/character';
import { readHistroyMessage } from '../db/message';
import { readPromptContent } from '../db/prompt';

type GeminiOptions = {
  roomId: number;
  promptId: number
  content:string,
  model: 'Gemini';
  model_version: GeminiModels;
  personnel: Array<string>;
};

export async function tranceHiGemini(options: GeminiOptions) {
  const key = await SecureStore.getItem('TRANCE_MODEL_GEMINI_KEY');
  if (!key) return;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: options.model_version });
  const prompt = await readGeminiPrompt(options.promptId,options.personnel,options.roomId)
  if(!prompt) return
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  });
  console.log(666)
  try{
    console.log(options.content)
    console.log(chat.sendMessage)
    const result = await chat.sendMessage(options.content);
    console.log(result)
    console.log(result.response.text())
    return result.response.text();
  }catch(error){
    console.log(error)
    return
    
  }


}

async function readGeminiHistroyMessage(roomId: number) {
  try {
    const result = await readHistroyMessage(roomId);
    if (!result) return
    if(result.length === 0) return "\n"
    const history = result.map((item) => item.content).join('\n');
    if (!history) return;
    return history;
  } catch (error) {
    console.log(error);
  }
}

async function readGeminiPrompt(promptId: number, personnel: Array<string>, roomId: number) {
  try {
    // 数据准备
    const history = await readGeminiHistroyMessage(roomId);
    if (!history) return;
    const promptContent = await readPromptContent(promptId);
    if (!promptContent) return;
    console.log(personnel)
    console.log(personnel[0])
    const character = await readCharacterById(Number(personnel[0]));
    if (!character) return;
    // 根据提示词排序替换
    promptContent.forEach((item) => {
      if (item.identifier === 'chatHistory') {
        item.content = history;
      }
      if (item.identifier === 'charDescription') {
        item.content = character.description || '';
      }
    });
    const activePrompt = promptContent.filter((item) => item.isEnabled === true);
    const prompt = activePrompt.map((item) => item.content).join('\n');
    return prompt;
  } catch (error) {
    console.log(error);
  }
}
