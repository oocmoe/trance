import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useCharacterById } from "@/hook/character";
import { updateCharacterFiledById } from "@/utils/db/character";
import { convertCover } from "@/utils/file/convert";
import { pickCharacterCover } from "@/utils/file/picker";
import { router, useLocalSearchParams } from "expo-router";
import {
	Car,
	GitCommit,
	IdCardIcon,
	Pencil,
	SquareUser,
	UserPen,
} from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { toast } from "sonner-native";

export default function CharacterEditorScreen() {
	return (
		<Box className="h-full w-full p-3">
			<CharacterCover />
			<CharacterName />
			<CharacterCreator />
			<CharacterVersion />
			<CharacterDescription />
		</Box>
	);
}

/**
 * 修改角色卡名称
 * @returns
 */
const CharacterName = () => {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");

	React.useEffect(() => {
		if (!character?.name) return;
		setName(character.name);
	}, [character]);

	const handleSave = async () => {
		try {
			const rows = await updateCharacterFiledById(Number(id), "name", name);
			if (rows) {
				setIsOpen(false);
				toast.success("修改成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<Box>
							<HStack className="items-center" space="md">
								<Icon as={IdCardIcon} />
								<Heading>角色卡名称</Heading>
							</HStack>
						</Box>
						<Icon as={Pencil} />
					</HStack>
				</Card>
			</Pressable>

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
							角色卡名称
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Input>
							<InputField value={name} onChangeText={setName} />
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
						<Button onPress={handleSave}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

/**
 * 修改角色卡作者
 * @returns
 */
const CharacterCreator = () => {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>("");

	React.useEffect(() => {
		if (!character?.creator) return;
		setName(character.creator);
	}, [character]);

	const handleSave = async () => {
		try {
			const rows = await updateCharacterFiledById(Number(id), "creator", name);
			if (rows) {
				setIsOpen(false);
				toast.success("修改成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<Box>
							<HStack className="items-center" space="md">
								<Icon as={UserPen} />
								<Heading>角色卡作者</Heading>
							</HStack>
						</Box>
						<Icon as={Pencil} />
					</HStack>
				</Card>
			</Pressable>

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
							角色卡作者
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Input>
							<InputField value={name} onChangeText={setName} />
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
						<Button onPress={handleSave}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

/**
 * 修改角色卡版本
 * @returns
 */
const CharacterVersion = () => {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [version, setVersion] = React.useState<string>("");

	React.useEffect(() => {
		if (!character?.version) return;
		setVersion(character.version);
	}, [character]);

	const handleSave = async () => {
		try {
			const rows = await updateCharacterFiledById(
				Number(id),
				"version",
				version,
			);
			if (rows) {
				setIsOpen(false);
				toast.success("修改成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error("未知错误");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<Box>
							<HStack className="items-center" space="md">
								<Icon as={GitCommit} />
								<Heading>角色卡版本</Heading>
							</HStack>
						</Box>
						<Icon as={Pencil} />
					</HStack>
				</Card>
			</Pressable>

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
							角色卡版本
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Input>
							<InputField value={version} onChangeText={setVersion} />
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
						<Button onPress={handleSave}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

/**
 * 修改角色卡封面
 * @returns
 */
const CharacterCover = () => {
	const { id } = useLocalSearchParams();
	const character = useCharacterById(Number(id));
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [cover, setCover] = React.useState<string>("");

	React.useEffect(() => {
		if (!character?.cover) return;
		setCover(character.cover);
	}, [character]);

	const handleChange = async () => {
		try {
			const result = await pickCharacterCover();
			if (!result) return;
			const coverBase64 = await convertCover(result.uri);
			if (!coverBase64) {
				toast.error("转换失败");
			}
			setCover(coverBase64);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "未知错误");
		}
	};
	const handleSave = async () => {
		try {
			const rows = await updateCharacterFiledById(Number(id), "cover", cover);
			if(rows){
				toast.success("更换成功");
				setIsOpen(false);
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "未知错误");
		}
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Card>
					<HStack className="justify-between items-center">
						<Box>
							<HStack className="items-center" space="md">
								<Icon as={SquareUser} />
								<Heading>角色卡封面</Heading>
							</HStack>
						</Box>
						<Icon as={Pencil} />
					</HStack>
				</Card>
			</Pressable>

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
							角色卡封面
						</Heading>
					</ModalHeader>
					<ModalBody>
						<Pressable onPress={handleChange}>
							<Image
								size="full"
								className="w-full aspect-[3/4]"
								source={{ uri: cover }}
								alt="cover"
							/>
						</Pressable>
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
						<Button onPress={handleSave}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

/**
 * 修改角色卡描述
 * @returns
 */
const CharacterDescription = () => {
	const { id } = useLocalSearchParams();

	return (
		<Box>
			<Pressable
				onPress={() => router.push(`/character/${id}/editor/description`)}
			>
				<Card>
					<HStack className="justify-between items-center">
						<Box>
							<HStack className="items-center" space="md">
								<Icon as={SquareUser} />
								<Heading>角色卡描述</Heading>
							</HStack>
						</Box>
						<Icon as={Pencil} />
					</HStack>
				</Card>
			</Pressable>
		</Box>
	);
};
