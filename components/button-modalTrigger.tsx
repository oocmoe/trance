import { Button } from "@/components/ui/button";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Icon from "@/components/Icon";
import type { ComponentType } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

type ModalTriggerButtonProps = {
	buttonText?: string;
	buttonIcon?: ComponentType<any>;
	variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null;
	title?: string;
	description?: string;
	submit?: () => void;
};
export const ButtonModalTrigger = ({
	buttonText,
	buttonIcon,
	variant,
	title,
	description,
	submit,
}: ModalTriggerButtonProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant={variant} className="flex flex-row items-center gap-x-1">
					{buttonText && <Text>{buttonText}</Text>}
					{buttonIcon && <Icon as={buttonIcon} />}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex flex-row justify-end items-center gap-x-2">
					<DialogTrigger asChild>
						<Button variant={"ghost"}>
							<Text>取消</Text>
						</Button>
					</DialogTrigger>
					<Button variant={variant} onPress={submit}>
						<Text>确定</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
