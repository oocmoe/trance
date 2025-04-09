import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalContent,
	ModalFooter,
} from "@/components/ui/modal";
import { Car, IdCardIcon, Pencil } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "react-native";
import React from "react";

export default function CharacterEditorScreen() {
	return (
		<Box className="h-full w-full p-3">
			<CharacterName />
		</Box>
	);
}

const CharacterName = () => {
	const [isOpen, setIsOpen] = React.useState(false);
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

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<ModalBackdrop />
				<ModalContent>
					<ModalBody>
						<Input>
							<InputField />
						</Input>
						<ModalFooter>
							<Button onPress={() => setIsOpen(false)} variant="outline">
								<ButtonText>取消</ButtonText>
							</Button>
							<Button>
								<ButtonText>保存</ButtonText>
							</Button>
						</ModalFooter>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};
