import { Storage } from 'expo-sqlite/kv-store';

/**
 * 匹配 {{user}} 替换为用户名
 * @param str
 */
export async function regexUserName(str: string) {
  try {
    const value = await Storage.getItem('TRANCE_USER_NAME');
    if (!value) {
      return str;
    }
    const regex = /\{\{user\}\}/gi;
    const result = str.replace(regex, value);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function regexPrompt(str: string, regexId: string[]) {
  try {
  } catch (error) {
    console.log(error);
  }
}

export async function regexHtmlTag(str: string) {
  try {
  } catch (error) {
    console.log(error);
  }
}
