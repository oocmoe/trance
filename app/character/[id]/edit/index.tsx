import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardNavItem } from "@/components/card-navItem";
import { useLocalSearchParams } from "expo-router";
import { MessageSquareMore, UserCog2 } from "lucide-react-native";
export default function CharacterIdEditScreen() {
	return (
		<SafeAreaView className="flex-1">
			<View className="p-3">
				<CharacterIdEditList />
			</View>
		</SafeAreaView>
	);
}

function CharacterIdEditList() {
	const { id } = useLocalSearchParams();
	return (
		<View className="flex flex-col gap-y-3">
			<CardNavItem label="角色描述" href={`/character/${id}/edit/description`} icon={UserCog2} />
			<CardNavItem label="开场白" href={`/character/${id}/edit/prologue`} icon={MessageSquareMore} />
		</View>
	);
}
