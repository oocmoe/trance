import { useRegexGroupById, useRegexListByGroupId } from "@/hook/useRegex";
import { router, Stack, useLocalSearchParams, useNavigation, usePathname } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import type { RegexGroupTable } from "@/db/schema";
import { toast } from "sonner-native";
import { createRegex, updateRegexGroupField } from "@/db/client";
import { Card } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { ArrowRight, Cog, Import, Pen, Settings, Settings2 } from "lucide-react-native";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { pickerJSON, pickerRegex } from "@/utils/picker";
import { converterSillyTavernRegexToTrance } from "@/utils/converter";
import { Heading } from "@/components/ui/heading";
export default function RegexGroupIdScreen() {
	const { id } = useLocalSearchParams();
	const regexGroup = useRegexGroupById(Number(id));
	return (
		<>
			<Stack.Screen options={{ title: regexGroup.name, headerRight: () => <ScreenHeaderRight /> }} />
			<View className="flex-1">
				<View className="flex-1">
					<ImportRegex />
					<RegexGroupName regexGroup={regexGroup} />
					<RegexGroupIsEnable regexGroup={regexGroup} />
					<RegexGroupType regexGroup={regexGroup} />
					<RegexList />
				</View>
			</View>
		</>
	);
}

function ScreenHeaderRight() {
	const { id } = useLocalSearchParams();
	return (
		<View className="flex flex-row justify-between items-center gap-x-2">
			<Pressable onPress={() => router.push(`/regex/${id}/option`)}>
				<Icon as={Settings2} />
			</Pressable>
		</View>
	);
}

function ImportRegex() {
	const { id } = useLocalSearchParams();
	const handleImportRegex = async () => {
		try {
			const data = await pickerRegex();
			if (!data) return;
			const regexData = {
				...data,
				regex_group_id: Number(id),
			};
			if (data) {
				await createRegex(Number(id), regexData);
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Heading>导入正则</Heading>
			<Pressable onPress={handleImportRegex}>
				<Icon as={Import} />
			</Pressable>
		</View>
	);
}

function RegexGroupIsEnable({ regexGroup }: { regexGroup: RegexGroupTable }) {
	const handleChangeIsEnable = async (value: boolean) => {
		try {
			await updateRegexGroupField(regexGroup.id, "is_enabled", value);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Text className="font-bold">开关</Text>
			<Switch checked={regexGroup.is_enabled} onCheckedChange={handleChangeIsEnable} />
		</View>
	);
}

function RegexGroupType({ regexGroup }: { regexGroup: RegexGroupTable }) {
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	const handleChange = async (value: string) => {
		try {
			await updateRegexGroupField(regexGroup.id, "type", value as "character" | "global");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View className="flex flex-row justify-between items-center p-3">
			<Text className="font-bold">作用范围</Text>
			<Select
				onValueChange={(e) => handleChange(e?.value as string)}
				defaultValue={{ value: regexGroup.type, label: regexGroup.type }}
			>
				<SelectTrigger>
					<SelectValue className="text-foreground text-sm native:text-lg" placeholder={regexGroup.type} />
				</SelectTrigger>
				<SelectContent insets={contentInsets}>
					<SelectGroup>
						<SelectItem label="character" value="character">
							character
						</SelectItem>
						<SelectItem label="global" value="global">
							global
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</View>
	);
}

function RegexGroupName({ regexGroup }: { regexGroup: RegexGroupTable }) {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");
	React.useEffect(() => {
		if (regexGroup.name) {
			setName(regexGroup.name);
		}
	}, [regexGroup]);
	const handleChangeName = async () => {
		try {
			await updateRegexGroupField(regexGroup.id, "name", name);
		} catch (error) {
			console.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		}
	};
	return (
		<View>
			<View className="flex flex-row justify-between items-center p-3">
				<Text className="font-bold">正则组名称</Text>
				<Pressable onPress={() => setIsOpen(true)}>
					<Icon as={Pen} />
				</Pressable>
			</View>
			<Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>正则组名称</DialogTitle>
						<DialogDescription>
							<Input className="w-full" value={name} onChangeText={setName} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex flex-row justify-end">
						<DialogClose asChild>
							<Button variant={"outline"}>
								<Text>Cancel</Text>
							</Button>
						</DialogClose>
						<Button disabled={name.length === 0} onPress={handleChangeName}>
							<Text>保存</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</View>
	);
}

function RegexList() {
	const { id } = useLocalSearchParams();
	const regex = useRegexListByGroupId(Number(id));
	return (
		<ScrollView>
			<View className="flex flex-col gap-y-2 p-3">
				{regex.map((item) => (
					<Card key={item.id}>
						<Pressable onPress={() => router.push(`/regex/${id}/${item.id}`)} className="p-3">
							<View className="flex flex-row justify-between items-center">
								<View className="flex flex-col gap-y-1">
									<Badge className={item.is_enabled ? "bg-green-400" : "bg-gray-400"}>
										<Text>{item.is_enabled ? "启用中" : "已禁用"}</Text>
									</Badge>
									<Text>{item.name}</Text>
								</View>
								<Icon as={ArrowRight} />
							</View>
						</Pressable>
					</Card>
				))}
			</View>
		</ScrollView>
	);
}
