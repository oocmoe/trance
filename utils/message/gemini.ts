import { GoogleGenerativeAI } from '@google/generative-ai';
import * as SecureStore from 'expo-secure-store';
import { readCharacterById } from '../db/character';
import { readHistroyMessage } from '../db/message';
import { readPromptContent } from '../db/promot';

type GeminiOptions = {
  roomId: number;
  promptId: number | null;
  model: 'Gemini';
  model_version: GeminiModels;
  personnel: string[];
};

export async function tranceHiGemini(options: GeminiOptions) {
  const key = await SecureStore.getItem('TRANCE_GEMINI_API_KEY');
  if (!key) return;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: options.model_version });
  const character = await readCharacterById(Number(options.personnel[0]));
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello' }]
      },
      {
        role: 'model',
        parts: [{ text: 'Great to meet you. What would you like to know?' }]
      }
    ]
  });
  const result = await chat.sendMessage('I have 2 dogs in my house.');
  if (result.response.text()) return;
  return result.response.text();
}

async function readGeminiHistroyMessage(roomId: number) {
  try {
    const result = await readHistroyMessage(roomId);
    if (!result) return;
    const history = result.map((item) => item.content).join('\n');
    if (!history) return;
    return history;
  } catch (error) {
    console.log(error);
  }
}

async function readGeminiPrompt(promptId: number, personnel: string[], roomId: number) {
  try {
    // 数据准备
    const history = await readGeminiHistroyMessage(roomId);
    if (!history) return;
    const promptContent = await readPromptContent(promptId);
    if (!promptContent) return;
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
