import type { ConvertSillyTavernChatHistory } from "@/types/result";
import { createImportMessages, deleteAllMessage } from "../db/message";

export async function importSillyTavernChatHistory(
	roomId: number,
	chatHistory: ConvertSillyTavernChatHistory[],
) {
	try {
		await deleteAllMessage(roomId);
		const messages = chatHistory.map((item) => {
			return {
				room_id: roomId,
				type: item.type,
				is_Sender: item.is_Sender,
				content: item.content,
				role: item.role,
			};
		});

		const rows = await createImportMessages(messages);
		return rows;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("导入聊天记录失败");
	}
}
