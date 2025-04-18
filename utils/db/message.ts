import { message, type Messages } from "@/db/schema/message";
import { useDB } from "@/hook/db";
import { desc, eq } from "drizzle-orm";
import "react-native-get-random-values";
import { v7 as uuidv7 } from "uuid";

const db = useDB();

/**
 * 创建消息
 * @param room_id
 * @param type
 * @param is_Sender
 * @param content
 * @param role
 * @returns
 */
export async function createMessage(
	room_id: number,
	type: "text",
	is_Sender: number,
	content: string,
	role: "assistant" | "user" | "system",
) {
	try {
		const rows = await db.insert(message).values({
			global_id: uuidv7(),
			room_id: room_id,
			type: type,
			is_Sender: is_Sender,
			content: [content],
			role: role,
		});
		if (!rows) return;
		return rows.lastInsertRowId;
	} catch (error) {
		console.log(error);
	}
}

export async function createImportMessages(
	messages: Array<{
		room_id: number;
		type: "text";
		is_Sender: number;
		content: string[];
		role: "assistant" | "user" | "system";
	}>,
) {
	try {
		const messagesData = messages.map((item) => ({
			...item,
			room_id: item.room_id,
			global_id: uuidv7(),
		}));
		const rows = await db.insert(message).values(messagesData);
		return rows.lastInsertRowId;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("创建聊天记录失败");
	}
}

export async function readMessageContentById(id: number) {
	try{
		const rows = await db.select({
			message:message.content
		}).from(message).where(eq(message.id, id))
		return rows[0].message
	}catch(error){
		console.log(error)
		throw error
	}
}

export async function updatePushMessage(
	messageId: number,
	content: string,
) {
	try{
		const updatedContent = await readMessageContentById(messageId)
		updatedContent.unshift(content)
		const rows = await db.update(message).set({
			content: updatedContent
		}).where(eq(message.id, messageId))
		return rows.changes
	}catch(error){
		console.log(error)
		throw error
	}
}

export async function updateMessageGroupToLast(messageId: number) {
  try {
    const updatedContent: string[] = await readMessageContentById(messageId) as unknown as string[];

    const [firstItem] = updatedContent.splice(0, 1);
    updatedContent.push(firstItem);

    const rows = await db.update(message).set({
      content: updatedContent,
    }).where(eq(message.id, messageId));

    return rows.changes;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function updateMessageGroupToFirst(messageId: number) {
  try {
    const updatedContent: string[] = await readMessageContentById(messageId) as unknown as string[];

    const lastItem = updatedContent.pop();
    if (lastItem !== undefined) {
      updatedContent.unshift(lastItem);
    }

    const rows = await db.update(message).set({
      content: updatedContent,
    }).where(eq(message.id, messageId));

    return rows.changes;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function readHistroyMessage(roomId: number) {
	try {
		const rows = await db
			.select({
				id: message.id,
				role: message.role,
				content: message.content,
			})
			.from(message)
			.where(eq(message.room_id, roomId));
		if (!rows) return;
		return rows;
	} catch (error) {
		console.log(error);
	}
}

export async function readMessageDescByIdOffset(
	roomId: number,
	offset: number,
) {
	try {
		const rows = await db
			.select()
			.from(message)
			.where(eq(message.room_id, roomId))
			.orderBy(desc(message.id))
			.offset(offset)
			.limit(10);
		return rows;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("创建聊天记录失败");
	}
}

export async function deleteMessageById(id: number) {
	try {
		const rows = await db.delete(message).where(eq(message.id, id));
		if (!rows) return;
		return rows.changes;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteAllMessage(roomId: number) {
	try {
		const rows = await db.transaction(async (tx) => {
			const deleteRows = await tx
				.delete(message)
				.where(eq(message.room_id, roomId));
			return deleteRows.changes;
		});
		return rows;
	} catch (error) {
		throw error instanceof Error
			? error.message
			: new Error("删除房间全部消息失败");
	}
}
