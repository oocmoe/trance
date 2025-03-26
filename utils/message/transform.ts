import type { KnowledgeBaseEntry } from "@/db/schema/knowledgeBase";
import { readIsEnableKnowledgeBase } from "../db/knowledgeBase";
import { readHistroyMessage } from "../db/message";

/**
 * 获取房间历史聊天记录
 * @param roomId
 * @returns
 */
export async function transformHistroyMessage(roomId: number) {
  const result = await readHistroyMessage(roomId);
  if (!result) throw new Error("读取消息记录失败");
  if (result.length === 0)
    return {
      history: "\n",
      lastAssistantContent: undefined,
    };
  let lastAssistantContent: string | undefined = undefined;
  let lastAssistantIndex = -1;
  for (let i = result.length - 1; i >= 0; i--) {
    const item = result[i];
    if (item.role === "assistant" && item.content?.trim()) {
      lastAssistantContent = item.content;
      lastAssistantIndex = i;
      break;
    }
  }
  const history = result
    .filter((_, index) => index !== lastAssistantIndex)
    .map((item) => item.content)
    .join("\n");
  return {
    history: history || "\n",
    lastAssistantContent,
  };
}

export async function transformKnowledgeBase(
  lastUserContent: string,
  lastAssistantContent?: string | undefined,
) {
  try {
    const lastContent = `${lastUserContent}\n${lastAssistantContent}`;
    const knowledgeBaseResult = await readIsEnableKnowledgeBase();
    let globalEntriesId = 1;
    const [keyEntries, alwaysEntries] = knowledgeBaseResult.reduce(
      ([keys, alwayss], kb) => {
        const processed = kb.entries
          .filter((entry) => entry.is_Enable)
          .map((entry) => ({ ...entry, id: globalEntriesId++ }));

        for (const entry of processed) {
          if (entry.trigger === "key") {
            keys.push(entry);
          } else {
            alwayss.push(entry);
          }
        }
        return [keys, alwayss];
      },
      [[] as KnowledgeBaseEntry[], [] as KnowledgeBaseEntry[]],
    );
    const contentKeywords = new Set(lastContent.split(/\s+/));
    const alwaysContent = alwaysEntries
      .map((entry) => entry.content?.trim())
      .filter(Boolean)
      .join("\n");
    const keyContent = keyEntries
      .filter((entry) => entry.keywords.some((k) => contentKeywords.has(k)))
      .map((entry) => entry.content)
      .join("\n");

    return [alwaysContent, keyContent].join("\n");
  } catch (error) {
    throw error instanceof Error ? error : new Error("转换世界书信息失败");
  }
}
