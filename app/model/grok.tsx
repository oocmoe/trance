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
import { AddIcon, Icon } from "@/components/ui/icon";
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
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { tranceHiGeminiTextTest } from "@/utils/message/gemini";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import {
	BoltIcon,
	CableIcon,
	CogIcon,
	KeyIcon,
	ListRestartIcon,
	PlugZapIcon,
	XIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";
export default function GrokScreen() {
	return (
		<Box className="h-ful p-3">
			<VStack space="md">
				<KeyGroup />
			</VStack>
		</Box>
	);
}


const KeyGroup = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [keyGroup, setKeyGroup] = React.useState<string[]>([]);
	const [key, setKey] = React.useState<string>("");
	const handleAddKey = () => {
		if (key.length === 0) {
			toast.error("密钥不能为空");
			return;
		}
		setKeyGroup([...keyGroup, key]);
		setKey("");
		toast.success("添加成功");
	};

	const handleDeleteKey = (index: number) => {
		setKeyGroup(keyGroup.filter((_, i) => i !== index));
		toast.success("删除成功");
	};

	const handleSaveKeyGroup = async () => {
		try {
			await SecureStore.setItem(
				"TRANCE_MODEL_GROK_KEY",
				JSON.stringify(keyGroup),
			);
			setIsOpen(false);
			toast.success("保存成功");
		} catch (error) {
			console.log(error);
			toast.error("保存失败");
		}
	};

	React.useEffect(() => {
		const fetchKeyGroup = async () => {
			const result = await SecureStore.getItem("TRANCE_MODEL_GROK_KEY");
			if (result) {
				const keyGroup = JSON.parse(result);
				setKeyGroup(keyGroup);
			}
		};
		fetchKeyGroup();
	}, []);
	return (
		<Box>
			{/* 卡片部分 */}
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<HStack space="md" className="items-center">
							<Icon as={KeyIcon} />
							<Heading>密钥</Heading>
						</HStack>
						<Icon as={BoltIcon} />
					</HStack>
				</Card>
			</Pressable>

			{/* 模态框部分 */}
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
						<HStack className="justify-between">
							<Heading size="md" className="text-typography-950">
								Grok 密钥
							</Heading>
						</HStack>
					</ModalHeader>
					<ModalBody className="max-h-[300px]">
            <Input>
              <InputField
                placeholder="请输入密钥"
                value={key}
                onChangeText={(text) => setKey(text)}
              />
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
						<Button onPress={handleSaveKeyGroup}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};