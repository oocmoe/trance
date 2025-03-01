import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { convertCharacter, convertCover, convertPrompt } from './convert';
import { decodeCharacter, decodeJson } from './decode';

/**
 * 选择json
 * @returns
 */
export async function pickFileJson() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json']
    });
    if (result.canceled) return;
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 选择png 图片
 * @returns
 */
export async function pickFilePng() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png']
    });
    console.log(result);
    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 选择角色卡封面
 * @returns 图片地址
 */
export async function pickUserAvatar() {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    console.log(result);
    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 选择角色卡封面
 * @returns 图片地址
 */
export async function pickCharacterCover() {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1
    });
    console.log(result);
    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 选取PNG格式角色卡
 * @returns
 */
export async function pickCharacterPng() {
  try {
    const assets = await pickFilePng();
    if (!assets) return;
    const cover = await convertCover(assets.uri);
    const decodeResult = await decodeCharacter(assets.uri);
    if (!decodeResult || !cover) return;
    const result = await convertCharacter(decodeResult, cover);
    if (!result) return;
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function pickPrompt() {
  try {
    const assets = await pickFileJson();
    if (!assets || !assets.assets || !assets.assets[0]?.uri) return;
    const json = await decodeJson(assets.assets[0].uri);
    if (!json) return;
    const convertedJson = await convertPrompt(json);
    if (!convertedJson) return;
    const prompt = {
      name: assets.assets[0].name,
      content: convertedJson
    };
    return prompt;
  } catch (error) {
    console.log(error);
  }
}
