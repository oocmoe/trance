import { Heading } from "@/components/ui/heading";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
export default function AboutScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "关于 trance" }} />
			<View className="p-3 flex flex-col gap-y-2">
        <Heading>喘息 trance</Heading>
        <Text>0.9.0</Text>
        <Heading>存储库</Heading>
        <Text>https://github.com/oocmoe/trance</Text>
        <Heading>联络</Heading>
        <Text>https://ooc.moe/trance</Text>
        <Text>contact@ooc.moe</Text>
        <Heading>滥用投诉</Heading>
        <Text>abuse@ooc.moe</Text>
      </View>
		</>
	);
}
