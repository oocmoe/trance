import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@/components/ui/select";
import { readRoomFieldById, updateRoomFieldById } from "@/utils/db/room";
import { useLocalSearchParams } from "expo-router";
import { Storage } from "expo-sqlite/kv-store";
import { atom, useAtom } from "jotai";
import { BotIcon, ChevronDownIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { toast } from "sonner-native";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Input, InputField } from "./ui/input";
import { Switch } from "./ui/switch";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
const models = [
	{
		order: 1,
		label: "Custom OpenAI",
		value: "Custom_OpenAI",
	},
	{
		order: 2,
		label: "Gemini",
		value: "Gemini",
	},
];

const modeAtom = atom<Models>();
const modelVersionAtom = atom<ModelVersionMap[Models]>();
const isCustomVersionAtom = atom<boolean>(false);

export const ModelSelect = () => {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [isCustomVersion, setIsCustomVersion] = useAtom(isCustomVersionAtom);
	const [model, setModel] = useAtom(modeAtom);
	const [modelVersion, setModelVersion] = useAtom(modelVersionAtom);
	const handleSaveModel = async () => {
		if (!model || !modelVersion) return;
		const data = {
			model: model,
			version: modelVersion,
		};
		try {
			const result = await updateRoomFieldById(Number(id), "model", data);
			if (result) {
				toast.success("保存成功");
				setIsOpen(false);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};

	React.useEffect(() => {
		const fetchModel = async () => {
			const result = (await readRoomFieldById(
				Number(id),
				"model",
			)) as ModelList;
			if (result) {
				setModel(result.model);
				setModelVersion(result.version);
			}
		};
		fetchModel();
	}, [id, setModel, setModelVersion]);

	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<HStack className="items-center" space="sm">
					<Icon as={BotIcon} />
					<Text>选择模型</Text>
				</HStack>
			</Pressable>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Box className="w-full">
							<HStack className="justify-between items-center">
								<Text>选择模型</Text>
								<HStack className="items-center">
									<Text>自定义版本号</Text>
									<Switch
										value={isCustomVersion}
										onValueChange={setIsCustomVersion}
									/>
								</HStack>
							</HStack>
						</Box>
					</ModalHeader>
					<ModalBody>
						<VStack space="md">
							<Select
								defaultValue={model}
								onValueChange={(value) => {
									setModel(value as Models);
									setModelVersion(undefined);
								}}
							>
								<SelectTrigger variant="outline" size="md">
									<SelectInput className="flex-1" />
									<SelectIcon className="mr-3" as={ChevronDownIcon} />
								</SelectTrigger>
								<SelectPortal>
									<SelectBackdrop />
									<SelectContent>
										<SelectDragIndicatorWrapper>
											<SelectDragIndicator />
										</SelectDragIndicatorWrapper>
										{models.map((item) => (
											<SelectItem
												key={item.order}
												label={item.label}
												value={item.value}
											/>
										))}
									</SelectContent>
								</SelectPortal>
							</Select>
							{model === "Custom_OpenAI" && <CustomModelOpenAIVersionSelect />}
							{model === "Gemini" && <GeminiModelVersionSelect />}
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="outline"
							action="secondary"
							onPress={() => {
								setIsOpen(false);
							}}
						>
							<ButtonText>取消</ButtonText>
						</Button>
						<Button
							isDisabled={!model || !modelVersion}
							onPress={handleSaveModel}
						>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const CustomModelOpenAIVersionSelect = () => {
	const [modelVersion, setModelVersion] = useAtom(modelVersionAtom);
	const [isCustomVersion, setIsCustomVersion] = useAtom(isCustomVersionAtom);
	React.useEffect(() => {
		const fetchModelVersion = async () => {
			const result = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_MODEL");
			if (result) setModelVersion(result);
		};
		fetchModelVersion();
	}, [setModelVersion]);
	if (isCustomVersion)
		return (
			<Box className="gap-y-2">
				<Text>自定义模型参数名</Text>
				<Input>
					<InputField value={modelVersion} onChangeText={setModelVersion} />
				</Input>
			</Box>
		);
	return (
		<Input isDisabled>
			<InputField value={modelVersion} />
		</Input>
	);
};

const geminiModelVersion = [

	{
		order: 1,
		label: "Gemini 2.5 Pro Exp 0325",
		value: "gemini-2.5-pro-exp-03-25",
	},
	{
		order: 2,
		label: "Gemini 2.0 Flash",
		value: "gemini-2.0-flash",
	},

	{
		order: 3,
		label: "Gemini 2.0 Flash-Lite",
		value: "gemini-2.0-flash-lite",
	},
	{
		order: 4,
		label: "Gemini 1.5 Flash",
		value: "gemini-1.5-flash",
	},
	{
		order: 5,
		label: "Gemini 1.5 Flash-8B",
		value: "gemini-1.5-flash-8b",
	},
	{
		order: 6,
		label: "Gemini 1.5 Pro",
		value: "gemini-1.5-pro",
	},
	{
		order: 7,
		label: "Gemini 2.5 Pro Preview 0325",
		value: "gemini-2.5-pro-preview-03-25",
	},
];

const GeminiModelVersionSelect = () => {
	const [modelVersion, setModelVersion] = useAtom(modelVersionAtom);
	const [isCustomVersion, setIsCustomVersion] = useAtom(isCustomVersionAtom);
	return (
		<Box>
			{isCustomVersion ? (
				<Box className="gap-y-2">
					<Text>自定义模型参数名</Text>
					<Input>
						<InputField value={modelVersion} onChangeText={setModelVersion} />
					</Input>
				</Box>
			) : (
				<Select defaultValue={modelVersion} onValueChange={setModelVersion}>
					<SelectTrigger variant="outline" size="md">
						<SelectInput className="flex-1" />
						<SelectIcon className="mr-3" as={ChevronDownIcon} />
					</SelectTrigger>
					<SelectPortal>
						<SelectBackdrop />
						<SelectContent>
							<SelectDragIndicatorWrapper>
								<SelectDragIndicator />
							</SelectDragIndicatorWrapper>

							{geminiModelVersion.map((item) => (
								<SelectItem
									key={item.order}
									label={item.label}
									value={item.value}
								/>
							))}
						</SelectContent>
					</SelectPortal>
				</Select>
			)}
		</Box>
	);
};
