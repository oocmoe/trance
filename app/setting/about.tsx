import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function AboutScreen() {
	return (
		<Box className="h-full p-3">
			<Heading>喘息(trance) By OoC 萌</Heading>
			<Text>版本: 0.8.1 开发者预览版</Text>
			<Text>存储库: github.com/oocmoe/trance</Text>
			<Text>联络: contact@ooc.moe</Text>
			<Text>滥用投诉: abuse@ooc.moe</Text>
		</Box>
	);
}
