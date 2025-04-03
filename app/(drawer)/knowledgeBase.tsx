import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
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
import { useKnowledgeBaseList } from "@/hook/knowledgeBase";
import { modalAtom } from "@/store/core";
import type { RenderKnowledgeBaseList } from "@/types/render";
import type { ConvertKnowledgeBaseResult } from "@/types/result";
import { createImportKnowledgeBase } from "@/utils/db/knowledgeBase";
import { pickKnowledgeBase } from "@/utils/file/picker";
import { Stack, router } from "expo-router";
import { atom, useAtom } from "jotai";
import { FileUpIcon, ImportIcon, LibraryIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";

const renderKnowledgeBaseListAtom = atom<RenderKnowledgeBaseList[]>();

export default function KnowledgeBaseScreen() {
	const list = useKnowledgeBaseList();
	const [inputValue, setInputValue] = React.useState<string>("");
	const [, setRenderKnowledgeBaseList] = useAtom(renderKnowledgeBaseListAtom);
	React.useEffect(() => {
		if (inputValue.length > 0) {
			const renderList = list.filter((item) =>
				item.name.toLowerCase().includes(inputValue.toLowerCase()),
			);
			setRenderKnowledgeBaseList(renderList);
		} else {
			setRenderKnowledgeBaseList(list);
		}
	}, [list, inputValue, setRenderKnowledgeBaseList]);
	return (
		<Box className="h-full">
			<Stack.Screen
				options={{
					headerSearchBarOptions: {
						placeholder: "搜索知识库",
						onChangeText: (e) => setInputValue(e.nativeEvent.text),
					},
				}}
			/>
			<KnowledgeBaseList />
			<KnowledgeBaseFab />
			<ImportKnowledgeBaseModal />
		</Box>
	);
}

const KnowledgeBaseList = () => {
	const [list] = useAtom(renderKnowledgeBaseListAtom);
	if (list === undefined)
		return (
			<Box className="w-full p-3">
				<Skeleton className="w-full h-14 " />
			</Box>
		);
	if (list.length === 0)
		return (
			<Box className="h-full justify-center items-center">
				<Box className="flex flex-col items-center gap-y-4">
					<Icon size="xl" as={LibraryIcon} />
					<Text>未找到相关知识库</Text>
				</Box>
			</Box>
		);
	return (
		<ScrollView>
			<VStack space="md" className="p-3">
				{list.map((item) => (
					<Pressable
						key={item.id}
						onPress={() => router.push(`/knowledgeBase/${item.id}`)}
						className="overflow-hidden"
					>
						<Card>
							<HStack className="justify-between items-center">
								<Text bold>{item.name}</Text>
								<Icon as={ArrowRightIcon} />
							</HStack>
						</Card>
					</Pressable>
				))}
			</VStack>
		</ScrollView>
	);
};

const KnowledgeBaseFab = () => {
	const [, setImportKnowledgeBaseModal] = useAtom(
		modalAtom("importKnowledgeBase"),
	);
	return (
		<Menu
			placement="top right"
			offset={5}
			trigger={({ ...triggerProps }) => {
				return (
					<Fab size="md" placement="bottom right" {...triggerProps}>
						<FabIcon as={AddIcon} />
					</Fab>
				);
			}}
		>
			<MenuItem
				onPress={() => setImportKnowledgeBaseModal(true)}
				key="Import knowledgeBase"
				textValue="Import knowledgeBase"
			>
				<Icon as={ImportIcon} size="sm" className="mr-2" />
				<MenuItemLabel size="sm">导入知识库</MenuItemLabel>
			</MenuItem>
		</Menu>
	);
};

const ImportKnowledgeBaseModal = () => {
	const [isOpen, setIsOpen] = useAtom(modalAtom("importKnowledgeBase"));
	const [name, setName] = React.useState<string>();
	const [previewData, setPreviewData] =
		React.useState<ConvertKnowledgeBaseResult>();
	const handleImport = async () => {
		try {
			const result = await pickKnowledgeBase();
			if (!result) return;
			setPreviewData(result);
			setName(result.name);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleImportKnowledgeBase = async () => {
		try {
			if (!name) {
				toast.error("知识库名称不能为空");
				return;
			}
			if (!previewData) {
				toast.error("数据未准备");
				return;
			}
			const result = await createImportKnowledgeBase(name, previewData);
			if (result) {
				setName(undefined);
				setPreviewData(undefined);
				setIsOpen(false);
				toast.success("导入成功");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};
	return (
		<Modal isOpen={isOpen} onClose={setIsOpen}>
			<ModalBackdrop />
			<ModalContent>
				<ModalHeader>
					<Heading>导入知识库</Heading>
					<Button onPress={handleImport}>
						<ButtonIcon as={FileUpIcon} />
					</Button>
				</ModalHeader>
				<ModalBody>
					{previewData && (
						<Box className="max-h-120">
							<VStack space="sm">
								<Text>知识库名称</Text>
								<Input>
									<InputField value={name} onChangeText={setName} />
								</Input>
							</VStack>
						</Box>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						onPress={handleImportKnowledgeBase}
						isDisabled={!previewData || name?.length === 0}
						className="w-full"
					>
						<ButtonText>确认导入</ButtonText>
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
