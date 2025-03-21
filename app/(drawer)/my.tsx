import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { USER_avtarAtom, USER_nameAtom } from "@/store/core";
import { pickUserAvatar } from "@/utils/file/picker";
import { Storage } from "expo-sqlite/kv-store";
import { useAtom } from "jotai";
import { CircleUserRoundIcon, UserPenIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { toast } from "sonner-native";

export default function MyScreen() {
	return (
		<Box className="h-full p-3">
			<VStack space="3xl">
				<UserDetail />
				<UserName />
				<UserAvatar />
			</VStack>
		</Box>
	);
}

const UserDetail = () => {
	const [avatar, setAvatar] = useAtom(USER_avtarAtom);
	const [name, setName] = useAtom(USER_nameAtom);
	return (
		<Box>
			<Card className="h-32">
				<HStack space="md">
					{avatar ? (
						<Image source={avatar} className="h-16 w-16 rounded-full" />
					) : (
						<Skeleton className="h-16 w-16 rounded-full" />
					)}
					<Text bold>{name}</Text>
				</HStack>
			</Card>
		</Box>
	);
};

const UserName = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [name, setName] = React.useState<string>();
	const [, setUserName] = useAtom(USER_nameAtom);
	React.useEffect(() => {
		const initName = async () => {
			const result = await Storage.getItem("TRANCE_USER_NAME");
			if (result) {
				setName(result);
			}
		};
		initName();
	}, []);
	const handleChangeName = async () => {
		if (!name) return;
		Storage.setItem("TRANCE_USER_NAME", name);
		setUserName(name);
		setIsOpen(false);
		toast.success("保存成功");
	};
	return (
		<Box>
			<Pressable onPress={() => setIsOpen(true)}>
				<Box>
					<HStack className="items-center" space="md">
						<Icon as={UserPenIcon} />
						<Text>更改用户名</Text>
					</HStack>
				</Box>
			</Pressable>
			<Modal isOpen={isOpen}>
				<ModalBackdrop />
				<ModalContent>
					<ModalHeader>
						<Text>更改用户名</Text>
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
						<Button onPress={handleChangeName} isDisabled={name?.length === 0}>
							<ButtonText>保存</ButtonText>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const UserAvatar = () => {
	const [, setAvatar] = useAtom(USER_avtarAtom);
	const handleChangeAvatar = async () => {
		const result = await pickUserAvatar();
		if (!result) return;
		Storage.setItem("TRANCE_USER_AVATAR", result.uri);
		setAvatar(result.uri);
		toast.success("更换成功");
	};
	return (
		<Box>
			<Pressable onPress={handleChangeAvatar}>
				<Box>
					<HStack className="items-center" space="md">
						<Icon as={CircleUserRoundIcon} />
						<Text>更换头像</Text>
					</HStack>
				</Box>
			</Pressable>
		</Box>
	);
};
