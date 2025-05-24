import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { toast } from "sonner-native";

export function usePreventBackIfEditing(isEditing: boolean) {
	const navigation = useNavigation();

	useEffect(() => {
		if (!isEditing) return;

		const preventBackAction = (e: any) => {
			e.preventDefault();
			toast.info("请先保存");
		};

		navigation.addListener("beforeRemove", preventBackAction);

		return () => {
			navigation.removeListener("beforeRemove", preventBackAction);
		};
	}, [isEditing, navigation]);
}
