import { FlatList, Pressable, ScrollView, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Text } from "@/components/ui/text";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useCharacter, useCharacterById } from "@/hook/useCharacter";
import { Image } from "expo-image";
import { atom, useAtom, useAtomValue } from "jotai";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Icon from "@/components/Icon";
import { CircleX, Import, Plus, Search, UserRoundSearch, X } from "lucide-react-native";
import { router } from "expo-router";
import type { CharacterTable } from "@/db/schema";
import React from "react";
import { cssInterop } from "nativewind";
import { BlurView } from "expo-blur";
import { Heading } from "@/components/ui/heading";
import { CharacterCard } from "@/components/character-card";

// nativewind
cssInterop(PagerView, { className: "style" });
cssInterop(Image, { className: "style" });

// jotai
const activeCharacterAtom = atom<number | undefined>(undefined);
const renderCharacterAtom = atom<Array<CharacterTable>>();
const isSearchingAtom = atom<boolean>(false);

export default function CharacterScreen() {
	const activeCharacter = useAtomValue(activeCharacterAtom);
	return (
		<SafeAreaView className="flex-1">
			<Header />
			<View className="flex-1">
				<CharacterList />
			</View>
		</SafeAreaView>
	);
}

function Header() {
	const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
	const list = useCharacter();
	const [searchingName, setSearchingName] = React.useState<string>("");
	const [, setRenderCharacterList] = useAtom(renderCharacterAtom);
	React.useEffect(() => {
		if (searchingName.length > 0) {
			const renderList = list.filter((item) => item.name.toLowerCase().includes(searchingName.toLowerCase()));
			setRenderCharacterList(renderList);
		} else {
			setRenderCharacterList(list);
		}
	}, [list, searchingName, setRenderCharacterList]);

	return (
		<View className="p-3">
			{isSearching ? (
				<View className="flex flex-row gap-x-4 items-center">
					<Input value={searchingName} onChangeText={setSearchingName} className="flex-1 rounded-full" />
					<Pressable onPress={() => setIsSearching(false)}>
						<Icon as={X} />
					</Pressable>
				</View>
			) : (
				<View className="flex flex-row justify-between items-center">
					<View>
						<Heading size="2xl">角色卡</Heading>
					</View>
					<View className="flex flex-row items-center gap-x-6">
						<Pressable onPress={() => router.push("/character/characterImport")}>
							<Icon as={Import} />
						</Pressable>
						<Pressable onPress={() => setIsSearching(true)}>
							<Icon as={Search} />
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

function CharacterList() {
	const [activeCharacter, setActiveCharacter] = useAtom(activeCharacterAtom);
	const [character] = useAtom(renderCharacterAtom);
	const fallbackData = useCharacter();
	const data = character ?? fallbackData;
	if (data.length === 0) {
		return (
			<View className="h-full pb-48 justify-center items-center">
				<Icon as={UserRoundSearch} />
				<Text>未找到相关角色卡</Text>
			</View>
		);
	}
	return (
		<FlatList
			data={data}
			numColumns={3}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<View className="p-3 w-1/3">
					<CharacterCard props={{ character: item }} />
				</View>
			)}
		/>
	);
}
