import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
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
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePromptList } from "@/hook/prompt";
import { readPromptFieldById } from "@/utils/db/prompt";
import {
	readRoomById,
	readRoomFieldById,
	updateRoomFieldById,
} from "@/utils/db/room";
import React from "react";
import { Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BotIcon, HammerIcon } from "lucide-react-native";
import { toast } from "sonner-native";

export default function RoomDetailScreen() {
	return <Options />;
}

const Options = () => {
	return (
		<Box className="m-3">
			<VStack space="sm">
				<Text>房间选项</Text>
				<Card>
					<VStack space="4xl">
						<ModelSelect />
						<PromptSelect />
					</VStack>
				</Card>
			</VStack>
		</Box>
	);
};

// 房间模型选择
const ModelSelect = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [model, setModel] = React.useState<Models>();
	const [version, setVersion] = React.useState<ModelVersionMap[Models]>();
	const { id } = useLocalSearchParams();
	const handleUpdateModel = (value: string) => {
		if (!value) return;
		setModel(value as Models);
	};
	const handleUpdateVersion = (value: string) => {
		if (!value) return;
		setVersion(value as ModelVersionMap[Models]);
	};
	const handleSaveModel = async () => {
		if (!model || !version) return;
		const data = {
			model: model,
			version: version,
		};
		const result = await updateRoomFieldById(Number(id), "model", data);
		if (!result) {
			toast.error("保存失败");
			return;
		}
		toast.success("保存成功");
		setIsOpen(false);
	};
	React.useEffect(() => {
		const initModel = async () => {
			const room = await readRoomById(Number(id));
			if (!room || !room.model?.model || !room.model?.version) return;
			setModel(room.model.model);
			setVersion(room.model.version);
		};
		initModel();
	}, []);

	const modelList = [
		{
			order: 1,
			label: "Gemini",
			value: "Gemini",
		},
	];

	const versionList = [
		{
			order: 1,
			label: "Gemini 2.0 Flash",
			value: "gemini-2.0-flash",
		},

		{
			order: 2,
			label: "Gemini 2.0 Flash-Lite",
			value: "gemini-2.0-flash-lite",
		},
		{
			order: 3,
			label: "Gemini 1.5 Flash",
			value: "gemini-1.5-flash",
		},
		{
			order: 4,
			label: "Gemini 1.5 Flash-8B",
			value: "gemini-1.5-flash-8b",
		},
		{
			order: 5,
			label: "Gemini 1.5 Pro",
			value: "gemini-1.5-pro",
		},
	];

	return (
		<>
			<Box>
				<Pressable onPress={() => setIsOpen(true)}>
					<HStack className="items-center" space="sm">
						<Icon as={BotIcon} />
						<Text>选择模型</Text>
					</HStack>
				</Pressable>
			</Box>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				size="md"
			>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Heading size="md" className="text-typography-950">
							选择模型
						</Heading>
					</ModalHeader>
					<ModalBody>
						<VStack space="sm">
							<Text>模型</Text>
							<Select onValueChange={handleUpdateModel} defaultValue={model}>
								<SelectTrigger>
									<SelectInput />
								</SelectTrigger>
								<SelectPortal>
									<SelectBackdrop />
									<SelectContent>
										<SelectDragIndicatorWrapper>
											<SelectDragIndicator />
										</SelectDragIndicatorWrapper>
										{modelList.map((item) => (
											<SelectItem
												key={item.order}
												value={item.value}
												label={item.label}
											/>
										))}
									</SelectContent>
								</SelectPortal>
							</Select>
							{model && (
								<>
									<Text>版本</Text>
									<Select
										onValueChange={handleUpdateVersion}
										defaultValue={version}
									>
										<SelectTrigger>
											<SelectInput />
										</SelectTrigger>
										<SelectPortal>
											<SelectBackdrop />
											<SelectContent>
												<SelectDragIndicatorWrapper>
													<SelectDragIndicator />
												</SelectDragIndicatorWrapper>
												{versionList.map((item) => (
													<SelectItem
														key={item.order}
														value={item.value}
														label={item.label}
													/>
												))}
											</SelectContent>
										</SelectPortal>
									</Select>
								</>
							)}
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
						<Button onPress={handleSaveModel}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

const PromptSelect = () => {
	const { id } = useLocalSearchParams();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [promptId, setPromptId] = React.useState<number>();
	const [placeholder, setPlaceholder] = React.useState<string>("");
	const prompt = usePromptList();
	const handleSavePrompt = async () => {
		const result = await updateRoomFieldById(
			Number(id),
			"prompt",
			Number(promptId),
		);
		if (!result) {
			toast.error("保存失败");
			return;
		}
		setIsOpen(false);
		toast.success("保存成功");
	};
	React.useEffect(() => {
		const initPrompt = async () => {
			const result = await readRoomFieldById(Number(id), "prompt");
			const placeholder = await readPromptFieldById(Number(result), "name");
			setPlaceholder(placeholder as string);
			setPromptId(Number(result));
		};
		initPrompt();
	}, [isOpen]);
	return (
		<>
			<Box>
				<Pressable onPress={() => setIsOpen(true)}>
					<HStack className="items-center" space="sm">
						<Icon as={HammerIcon} />
						<Text>选择提示词</Text>
					</HStack>
				</Pressable>
			</Box>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				size="md"
			>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Heading size="md" className="text-typography-950">
							选择提示词
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Select onValueChange={(value) => setPromptId(Number(value))}>
							<SelectTrigger>
								<SelectInput placeholder={placeholder} />
							</SelectTrigger>
							<SelectPortal>
								<SelectBackdrop />
								<SelectContent>
									<SelectDragIndicatorWrapper>
										<SelectDragIndicator />
									</SelectDragIndicatorWrapper>
									{prompt.map((item) => (
										<SelectItem
											key={item.id}
											value={String(item.id)}
											label={item.name}
										/>
									))}
								</SelectContent>
							</SelectPortal>
						</Select>
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
						<Button onPress={handleSavePrompt}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
