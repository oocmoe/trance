import Icon from "@/components/Icon";
import { Edit, Save } from "lucide-react-native";
import type React from "react";
import { Pressable } from "react-native";

type ButtonEditTriggerProps = {
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => Promise<void> | void;
};

export const ButtonEditTrigger = ({ isEditing, setIsEditing, onSubmit }: ButtonEditTriggerProps) => {
	return (
		<Pressable
			onPress={async () => {
				if (isEditing) {
					await onSubmit();
					setIsEditing(false);
				} else {
					setIsEditing(true);
				}
			}}
		>
			<Icon as={isEditing ? Save : Edit} />
		</Pressable>
	);
};
