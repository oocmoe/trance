import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { createRegexGroup } from "@/db/client";
import type { RegexGroupTableInsert } from "@/db/schema";
import { at } from "es-toolkit";
import { router } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const regexGroupIsEnabled = atom<boolean>(false);
const regexGroupNameAtom = atom<string>("");
const regexGroupTypeAtom = atom<"character" | "global">("global");

export default function NewRegexGroupModal() {
	return (
		<View className="flex-1">
			<View className="flex flex-col flex-1">
				<RegexGroupIsEnabled />
				<RegexGroupName />
				{/* <RegexGroupType /> */}
			</View>

			<RegexGroupSave />
		</View>
	);
}

function RegexGroupIsEnabled() {
	const [isEnabled, setIsEnabled] = useAtom(regexGroupIsEnabled);
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Label>启用</Label>
			<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
		</View>
	);
}

function RegexGroupName() {
	const [name, setName] = useAtom(regexGroupNameAtom);
	return (
		<View className="flex flex-col gap-y-2 p-3">
			<Label>正则组名称</Label>
			<Input value={name} onChangeText={setName} />
		</View>
	);
}

// function RegexGroupType() {
// 	const [type, setType] = useAtom(regexGroupTypeAtom);
// 	return (
// 		<View className="flex flex-col gap-y-2 p-3">
//       <Label>正则组类型</Label>
// 			<RadioGroup value={type} onValueChange={(value) => setType(value as "character" | "global")}>
//         <View className="flex-row justify-between items-center gap-x-2">
//           <Text>Character</Text>
// 				  <RadioGroupItem value="character" />
//         </View>
//         <View className="flex-row justify-between items-center gap-x-2">
//           <Text>Global</Text>
// 				  <RadioGroupItem value="global" />
//         </View>
// 			</RadioGroup>
// 		</View>
// 	);
// }mm

function RegexGroupSave() {
	const name = useAtomValue(regexGroupNameAtom);
	const isEnabled = useAtomValue(regexGroupIsEnabled);
	const handleSave = async () => {
		try {
			const regex: RegexGroupTableInsert = {
				name: name,
				type: "global",
				is_enabled: isEnabled,
			};
			const result = await createRegexGroup(regex);
			if (result) {
				router.replace("/regex");
				setTimeout(() => {
					router.push(`/regex/${result}`);
				}, 0);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="p-3">
			<Button disabled={name.length === 0} onPress={handleSave}>
				<Text>保存正则组</Text>
			</Button>
		</View>
	);
}
