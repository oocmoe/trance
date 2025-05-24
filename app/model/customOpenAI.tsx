import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { atom, useAtom } from "jotai";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Storage } from "expo-sqlite/kv-store";
import * as SecureStore from "expo-secure-store";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { toast } from "sonner-native";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heading } from "@/components/ui/heading";

// jotai
const keyAtom = atom<string>("");
const urlAtom = atom<string>("");

export default function CustomOpenAIScreen() {
	return (
		<View className="flex-1">
			<View className="flex flex-col gap-y-4 p-3">
				<CustomOpenAIUrl />
				<CustomOpenAIKey />
			</View>
			<CustomOpenFetchModel />
		</View>
	);
}

function CustomOpenAIUrl() {
	const [url, setUrl] = useAtom(urlAtom);
	React.useEffect(() => {
		const fetchUrl = async () => {
			const url = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_URL");
			if (url) setUrl(url);
		};
		fetchUrl();
	}, [setUrl]);
	return (
		<View>
			<Label>自定义 OpenAI URL</Label>
			<Input value={url} onChangeText={setUrl} />
		</View>
	);
}

function CustomOpenAIKey() {
	const [key, setKey] = useAtom(keyAtom);
	React.useEffect(() => {
		const fetchUrl = async () => {
			const key = await SecureStore.getItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY");
			if (key) setKey(key);
		};
		fetchUrl();
	}, [setKey]);
	return (
		<View>
			<Label>自定义 OpenAI 密钥</Label>
			<Input secureTextEntry value={key} onChangeText={setKey} />
		</View>
	);
}

function CustomOpenFetchModel() {
	const [url, setUrl] = useAtom(urlAtom);
	const [key, setKey] = useAtom(keyAtom);
	const [modelList, setModelList] = React.useState<Array<string>>([]);
	const [version, setVersion] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedVersion,setSelectedVersion] = React.useState<string>("")
	const handleFetchModel = async () => {
		setIsLoading(true);
		try {
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_URL", url);
			await SecureStore.setItem("TRANCE_MODEL_CUSTOM_OPENAI_KEY", key);
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};
			headers.Authorization = `Bearer ${key}`;
			const result = await fetch(`${url}/models`, {
				method: "GET",
				headers: headers,
			});
			if(!result.ok){
				throw new Error(`!ERROR_REMOTE_${result.status} : ${result.statusText}`)
			}
			const { data } = await result.json();
			console.log(result)
			const list = data.map((item: { id: string }) => item.id);
			setModelList(list);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () =>{
		try{
			await Storage.setItem("TRANCE_MODEL_CUSTOM_OPENAI_VERSION", version);
			setSelectedVersion(version)
		}catch(error){
			console.error(error)
			toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN")
		}
	}

	React.useEffect(()=>{
		const fetchVersion = async () => {
			try{
				const result = await Storage.getItem("TRANCE_MODEL_CUSTOM_OPENAI_VERSION");
				if(result) setSelectedVersion(result) 
			}catch(error){
				console.error(error)
				toast.error(error instanceof Error ? error.message : "!ERROR_UNKNOWN")
			}
		}
		fetchVersion()
	},[])
	return (
		<View className="flex-1 p-3 gap-y-2">
			<View className="flex flex-row justify-between items-center">
				<Heading>当前模型</Heading>
				<Text>{selectedVersion}</Text>
			</View>
			<View className="flex flex-row justify-between items-center">
				<Label>获取远程模型</Label>
				<Button disabled={isLoading} onPress={handleFetchModel}>
					{isLoading ? <ActivityIndicator /> : <Text>连接</Text>}
				</Button>
			</View>
			<View className="flex-1">
				<ScrollView>
					<RadioGroup value={version} onValueChange={(value) => setVersion(value)}>
						{modelList.map((item, index) => (
							<View key={String(index)} className="flex flex-row items-center gap-x-2">
								<RadioGroupItem value={item} />
								<Label>{item}</Label>
							</View>
						))}
					</RadioGroup>
				</ScrollView>
			</View>
			<View>
				<Button onPress={handleSave}><Text>保存</Text></Button>
			</View>
		</View>
	);
}
