import { Box } from "@/components/ui/box";
import {
	Button,
	ButtonIcon,
	ButtonSpinner,
	ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CircleIcon, Icon, LinkIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import {
	Radio,
	RadioGroup,
	RadioIcon,
	RadioIndicator,
	RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { RenderCustomOpenAIModelConfig } from "@/types/render";
import { tranceHiCustomoOpenAITextTest } from "@/utils/message/customOpenAI";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import {
	CableIcon,
	CogIcon,
	KeyIcon,
	ListMinusIcon,
	PlugZapIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";

type NewApiModelsResult = {
	data: Array<{
		id: string;
		object: "model";
		created: number;
		owned_by: "vertex-ai" | "custom" | string;
		permission: Array<{
			id: string;
			object: "model_permission";
			created: number;
			allow_create_engine: boolean;
			allow_sampling: boolean;
			allow_logprobs: boolean;
			allow_search_indices: boolean;
			allow_view: boolean;
			allow_fine_tuning: boolean;
			organization: string;
			group: null;
			is_blocking: boolean;
		}>;
		root: string;
		parent: null;
	}>;
	success: boolean;
};

export default function CustomOpenAIScreen() {
	return (
		<Box className="h-full p-3">
			<VStack space="md">
				<ApiUrl />
				<Key />
				<RemoteModelConfigSelect />
				<RemoteModelsSelect />
				<TextTest />
			</VStack>
		</Box>
	);
}

const Key = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [key, setKey] = React.useState<string>("******************");
	const handleSaveKey = async () => {
		try {
			await SecureStore.setItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY", key);
			setKey("******************");
			setIsOpen(false);
			toast.success("保存成功");
		} catch (error) {
			setKey("******************");
			console.log(error);
			toast.error("保存失败");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack className="items-center" space="md">
							<Icon as={KeyIcon} />
							<Heading>密钥</Heading>
						</HStack>
						<Icon as={CogIcon} />
					</HStack>
				</Card>
			</Pressable>
			<Modal isOpen={isOpen}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Heading>密钥</Heading>
					</ModalHeader>
					<ModalBody>
						<Input variant="outline" size="md">
							<InputField value={key} onChangeText={setKey} type="password" />
						</Input>
						<Text className="mt-2">密钥保存后无法查看或重复相同保存</Text>
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
							isDisabled={key === "******************"}
							onPress={handleSaveKey}
						>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const ApiUrl = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [apiUrl, setApiUrl] = React.useState<string>("");
	const handleSaveApiUrl = async () => {
		try {
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_URL", apiUrl);
			setIsOpen(false);
			toast.success("保存成功");
		} catch (error) {
			console.log(error);
			toast.error("保存失败");
		}
	};
	React.useEffect(() => {
		const fetchApiUrl = async () => {
			const result = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
			if (result) {
				setApiUrl(result);
			}
		};
		fetchApiUrl();
	}, []);
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack className="items-center" space="md">
							<Icon as={LinkIcon} />
							<Heading>请求地址</Heading>
						</HStack>
						<Icon as={CogIcon} />
					</HStack>
				</Card>
			</Pressable>
			<Modal isOpen={isOpen}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Heading>请求地址</Heading>
					</ModalHeader>
					<ModalBody>
						<Input>
							<InputField value={apiUrl} onChangeText={setApiUrl} />
						</Input>
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
						<Button onPress={handleSaveApiUrl}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const RemoteModelConfigSelect = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [modelConfig, setModelConfig] = React.useState<
		RenderCustomOpenAIModelConfig | undefined
	>(undefined);
	const [actionModel, setActionModel] = React.useState<string>("");
	const fetchModelConfig = async () => {
		try {
			const apiUrl = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
			if (!apiUrl || apiUrl.length === 0) {
				throw new Error("请求地址不能为空");
			}
			const response = await fetch(`${apiUrl}/chat/model_config`);
			const result: RenderCustomOpenAIModelConfig = await response.json();
			if (result.status !== 200) {
				throw new Error("获取模型失败，请检查请求地址");
			}
			setModelConfig(result);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	const handleSaveModel = async () => {
		try {
			if (!actionModel) {
				toast.error("未选择模型");
				return;
			}
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_MODEL", actionModel);
			setIsOpen(false);
			toast.success("保存成功");
		} catch (error) {
			console.log(error);
			toast.error("保存失败");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack className="items-center" space="md">
							<Icon as={ListMinusIcon} />
							<Heading>远程模型 /chat/model_config</Heading>
						</HStack>
						<Icon as={CogIcon} />
					</HStack>
				</Card>
			</Pressable>

			<Modal isOpen={isOpen}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader className="flex flex-row justify-between items-center">
						<Heading>远程模型 /chat/model_config</Heading>

						<Button onPress={fetchModelConfig}>
							<ButtonIcon as={PlugZapIcon} />
						</Button>
					</ModalHeader>
					<ModalBody className="max-h-64">
						{modelConfig?.data && (
							<ScrollView>
								<VStack>
									<RadioGroup onChange={(value) => setActionModel(value)}>
										{modelConfig.data[0].params_list[0].dataRange?.map(
											(item) => (
												<Radio
													key={item.name}
													value={item.value}
													size="md"
													isInvalid={false}
													isDisabled={false}
												>
													<RadioIndicator>
														<RadioIcon as={CircleIcon} />
													</RadioIndicator>
													<RadioLabel>{item.name}</RadioLabel>
												</Radio>
											),
										)}
									</RadioGroup>
								</VStack>
							</ScrollView>
						)}
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
							onPress={handleSaveModel}
							isDisabled={modelConfig === undefined}
						>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const RemoteModelsSelect = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [modelConfig, setModelConfig] = React.useState<
		NewApiModelsResult | undefined
	>(undefined);
	const [actionModel, setActionModel] = React.useState<string>("");
	const fetchModelConfig = async () => {
		try {
			const apiUrl = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
			const apiKey = await SecureStore.getItem(
				"TRANCE_MODEL_CUSTOM_OPENAI_KEY",
			);
			if (!apiUrl || apiUrl.length === 0) {
				throw new Error("请求地址不能为空");
			}
			const response = await fetch(`${apiUrl}/models`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
			});
			const result: NewApiModelsResult = await response.json();
			if (!result.success) {
				throw new Error("获取模型失败，请检查请求地址或者密钥");
			}
			setModelConfig(result);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	const handleSaveModel = async () => {
		try {
			if (!actionModel) {
				toast.error("未选择模型");
				return;
			}
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_MODEL", actionModel);
			setIsOpen(false);
			toast.success("保存成功");
		} catch (error) {
			console.log(error);
			toast.error("保存失败");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack className="items-center" space="md">
							<Icon as={ListMinusIcon} />
							<Heading>远程模型 /models</Heading>
						</HStack>
						<Icon as={CogIcon} />
					</HStack>
				</Card>
			</Pressable>

			<Modal isOpen={isOpen}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader className="flex flex-row justify-between items-center">
						<Heading>远程模型 /models</Heading>

						<Button onPress={fetchModelConfig}>
							<ButtonIcon as={PlugZapIcon} />
						</Button>
					</ModalHeader>
					<ModalBody className="max-h-64">
						{modelConfig?.data && (
							<ScrollView>
								<VStack>
									<RadioGroup onChange={(value) => setActionModel(value)}>
										{modelConfig.data.map((item) => (
											<Radio
												key={item.id}
												value={item.id}
												size="md"
												isInvalid={false}
												isDisabled={false}
											>
												<RadioIndicator>
													<RadioIcon as={CircleIcon} />
												</RadioIndicator>
												<RadioLabel>{item.id}</RadioLabel>
											</Radio>
										))}
									</RadioGroup>
								</VStack>
							</ScrollView>
						)}
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
							onPress={handleSaveModel}
							isDisabled={modelConfig === undefined}
						>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const TextTest = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [content, setContent] = React.useState<string | undefined>(undefined);
	const handleText = async () => {
		try {
			setIsLoading(true);
			const result = await tranceHiCustomoOpenAITextTest();
			if (result) {
				setContent(JSON.stringify(result));
				toast.success("获取响应成功");
			}
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack className="items-center" space="md">
							<Icon as={CableIcon} />
							<Heading>模型文字通信测试</Heading>
						</HStack>
						<Icon as={CogIcon} />
					</HStack>
				</Card>
			</Pressable>

			<Modal
				onClose={() => {
					setIsOpen(false);
				}}
				isOpen={isOpen}
			>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader className="flex flex-row justify-between items-center">
						<Heading>模型文字通信测试</Heading>

						<Button isDisabled={isLoading} onPress={handleText}>
							{isLoading ? (
								<ButtonSpinner />
							) : (
								<ButtonIcon variant="outline" as={PlugZapIcon} />
							)}
						</Button>
					</ModalHeader>
					<ModalBody className="max-h-64">
						{content && <Text>{content}</Text>}
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};
