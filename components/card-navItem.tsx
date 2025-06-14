import { Card } from "@/components/ui/card";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import Icon from "@/components/Icon";
import { ArrowRight } from "lucide-react-native";
import { type Href, router } from "expo-router";
import StatusBadge from "@/components/StatusBadge";
type CardNavItemProps = {
	label: string;
	href: Href;
	status?: "active" | "offline";
	icon?:React.ComponentType<any>;
};

export const CardNavItem = ({ label, href, status,icon }: CardNavItemProps) => {
	return (
		<Pressable className="active:opacity-80" onPress={() => router.push(href)}>
			<View className="flex flex-row justify-between items-center p-3 border border-slate-200 dark:border-slate-800 rounded-md">
				<View className="flex-1 min-w-0 flex-row items-center gap-x-1">
					{status && <StatusBadge status={status} />}
					{icon && <Icon as={icon} />}
					<Text className="truncate flex-shrink font-bold" numberOfLines={1} ellipsizeMode="tail">
						{label}
					</Text>
				</View>
				<View className="w-6 flex items-center justify-center">
					<Icon as={ArrowRight} />
				</View>
			</View>
		</Pressable>
	);
};
