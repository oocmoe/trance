import { useAtom } from "jotai";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Text } from "./ui/text";
import { tranceUserAvatarAtom } from "@/store/core";
export default function TranceUserAvatar() {
	const [userAvatar] = useAtom(tranceUserAvatarAtom);
	return (
		<Avatar className="w-20 h-20 rounded-xl border-2 border-gray-100 shadow-sm" alt="trance_user_avatar">
			<AvatarImage source={{ uri: userAvatar }} />
			<AvatarFallback>
				<Text>OoC</Text>
			</AvatarFallback>
		</Avatar>
	);
}
