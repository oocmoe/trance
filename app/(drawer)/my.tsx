import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useAtom } from "jotai";
import { tranceUserAvatarAtom, tranceUsernameAtom } from "@/store/core";
import { Image } from "expo-image";
import { toast } from "sonner-native";
import { pickerUserAvatar } from "@/utils/picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
export default function MyScreen() {
	return (
		<SafeAreaView className="flex-1 p-3 pt-16">
			<View className="flex flex-col gap-y-4 justify-center items-center">
				<MyAvatar />
				<MyName />
			</View>
		</SafeAreaView>
	);
}

function MyAvatar() {
	const [userAvatar, setUserAvatar] = useAtom(tranceUserAvatarAtom);
	const handleChangeCover = async () => {
		try {
			const result = await pickerUserAvatar();
			if (result) setUserAvatar(result);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-col justify-center items-center">
			<Pressable onPress={handleChangeCover}>
				<Avatar className="h-32 w-32" alt="trance_user_avatar">
					<AvatarImage source={{ uri: userAvatar }} />
					<AvatarFallback>
						<Text>OoC</Text>
					</AvatarFallback>
				</Avatar>
			</Pressable>
		</View>
	);
}

function MyName() {
	const [username, setUserName] = useAtom(tranceUsernameAtom);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Pressable>
					<Text className="font-bold text-3xl">{username}</Text>
				</Pressable>
			</DialogTrigger>
			<DialogContent className="w-96">
				<DialogHeader>
					<DialogTitle>修改用户名</DialogTitle>
				</DialogHeader>
				<Input value={username} onChangeText={setUserName} />
			</DialogContent>
		</Dialog>
	);
}
