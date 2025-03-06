import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

/**
 * 处理角色卡封面
 * @param data
 */
export async function convertCover(uri: string) {
  try {
    const coverBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64'
    });
    const cover = `data:image/png;base64,${coverBase64}`;
    return cover;
  } catch (error) {}
}

/**
 * 转换角色卡为 trance格式,这里只做转换检测
 * @param characterJson
 */
export async function convertCharacter(characterJson: any, cover: string) {
  try {
    // Spec V2
    if (characterJson.spec === 'chara_card_v2') {
      const result = await covertCharacterTavernCardV2(characterJson, cover);
      return result;
    }
    // Spec V1
    if (characterJson.name) {
      const result = await convertCharacterTavernCardV1(characterJson as TavernCardV1);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 转换提示词为 trance格式，这里只做转换检测
 * @param promptJson
 */
export async function convertPrompt(promptJson: any) {
  try {
    if (promptJson.prompt_order && promptJson.prompts) {
      const result = await convertPromptSillyTavern(promptJson as SillyTavermPrompt);
      if (!result) return;
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function convertRegex(promptJson: any) {
  try {
    if (promptJson.scriptName && promptJson.findRegex) {
      const result = await convertRegexSillyTavern(promptJson);
      if (!result) return;
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 转换 TavernCardV1
 * @param characterJson
 */
async function convertCharacterTavernCardV1(characterJson: TavernCardV1) {
  try {
  } catch (error) {
    console.log(error);
  }
}

/**
 * 转换 TavernCardV2
 * @param characterJson
 */
async function covertCharacterTavernCardV2(characterJson: TavernCardV2, cover: string) {
  try {
    const prologue = () => {
      const first_mes = {
        name: characterJson.data.first_mes.slice(0, 20),
        content: characterJson.data.first_mes
      };
      const alternate_greetings = characterJson.data.alternate_greetings.map((item) => {
        return {
          name: item.slice(0, 20),
          content: item
        };
      });
      if (alternate_greetings.length > 0) {
        return [first_mes, ...alternate_greetings];
      }
      return Array(first_mes);
    };

    const character = {
      global_id: uuidv7(),
      cover: cover,
      name: characterJson.data.name,
      description: characterJson.data.description,
      prologue: prologue(),
      creator: characterJson.data.creator,
      handbook: characterJson.data.creator_notes,
      version: characterJson.data.character_version,
      personality: characterJson.data.personality,
      scenario: characterJson.data.scenario,
      mes_example: characterJson.data.mes_example,
      system_prompt: characterJson.data.system_prompt,
      post_history_instructions: characterJson.data.post_history_instructions
    };
    const converData = {
      character: character
    };

    return converData;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 转换提示
 * @param promptJson
 * @returns
 */
async function convertPromptSillyTavern(promptJson: SillyTavermPrompt) {
  try {
    const order = promptJson.prompt_order.at(-1);
    if (!order?.order?.length) return [];
    const orderMap = new Map<string, number>();
    const isEnabledMap = new Map<string, boolean>();
    order.order.forEach((item, index) => {
      orderMap.set(item.identifier, index);
      isEnabledMap.set(item.identifier, item.enabled);
    });
    const processedPrompts = promptJson.prompts.map((item) => ({
      name: item.name,
      role: item.role || 'system',
      content: item.content,
      identifier: item.identifier,
      isEnabled: isEnabledMap.get(item.identifier) ?? false
    }));
    const sortedPrompts = processedPrompts.sort((a, b) => {
      const aOrder = orderMap.get(a.identifier) ?? Infinity;
      const bOrder = orderMap.get(b.identifier) ?? Infinity;
      return aOrder - bOrder;
    });
    return sortedPrompts.map((item, index) => ({
      id: index + 1,
      ...item
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function convertRegexSillyTavern(promptJson: SillyTavermRegex) {
  try {
    const regexScript = {
      name: promptJson.scriptName,
      replace: promptJson.findRegex,
      placement: promptJson.replaceString,
      is_Enabled: !promptJson.disabled,
      is_Global: false,
      is_Send: promptJson.placement.includes(2) || false,
      is_Render: promptJson.placement.includes(1) || false
    };
    if (!regexScript) return;
    return regexScript;
  } catch (error) {
    console.log(error);
  }
}
