import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
	return (
		<View>
			<SafeAreaView>
				<Link href="/(drawer)">
					<Text>Go Back</Text>
				</Link>
			</SafeAreaView>
		</View>
	);
}
