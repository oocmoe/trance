import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';
/**
 * 处理角色卡封面
 * @param data 
 */
export async function convertCover(uri:string) {
  try{
    const coverBase64 = await FileSystem.readAsStringAsync(uri,{
      encoding:"base64"
    })
    const cover = `data:image/png;base64,${coverBase64}`
    console.log(cover)
    return cover
  }catch(error){
    
  }
}

/**
 * 转换角色卡为 trance格式,这里只做转换检测
 * @param characterJson
 */
export async function convertCharacter(characterJson: any, cover:string) {
  try {
    // Spec V2
    if (characterJson.spec === 'chara_card_v2') {
      const result = await covertCharacterTavernCardV2(characterJson,cover);
      return result
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
 * 转换 TavernCardV1
 * @param characterJson 
 */
async function convertCharacterTavernCardV1(characterJson: TavernCardV1) {
  try{
    
  }catch(error){
    console.log(error)
  }
}


/**
 * 转换 TavernCardV2
 * @param characterJson 
 */
async function covertCharacterTavernCardV2(characterJson: TavernCardV2,cover:string) {
  try{

    const character = {
      global_id: uuidv7(),
      cover: cover,
      name:characterJson.data.name,
      description:characterJson.data.description,
      prologue: characterJson.data.alternate_greetings.splice(0, 0, characterJson.data.first_mes),
      creator:characterJson.data.creator,
      handbook:characterJson.data.creator_notes,
      version:characterJson.data.character_version,
      personality:characterJson.data.personality,
      scenario:characterJson.data.scenario,
      mes_example:characterJson.data.mes_example,
      system_prompt:characterJson.data.system_prompt,
      post_history_instructions:characterJson.data.post_history_instructions,
    }

    const converData = {
      character:character
    }

    return converData

  }catch(error){
    console.log(error)
  }
}
