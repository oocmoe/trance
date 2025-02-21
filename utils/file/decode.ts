import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';

/**
 * 解码 角色卡
 * @param uri 临时文件地址
 */
export async function decodeCharacter(uri: string) {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64'
    });
    const fileBinary = Buffer.from(fileBase64, 'base64');
    console.log(fileBinary);
  } catch (e) {
    console.log(e);
  }
}
