import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useAtomValue } from "jotai";
import { tranceIsDarkModeAtom } from "@/store/core";
import { Heading } from "@/components/ui/heading";
import { Portal } from "@rn-primitives/portal";

type SelectBottomSheetProps = {
	label: string;
	value: string;
	options: { label: string; value: string }[];
	onValueChange: (value: string) => void;
	disabled?: boolean;
};

export const SelectBottomSheet: React.FC<SelectBottomSheetProps> = ({ label, value, options, onValueChange, disabled = false, }) => {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedValue, setSelectedValue] = useState(value);
	const isDarkMode = useAtomValue(tranceIsDarkModeAtom);
	const sheetHeight = Dimensions.get("window").height * 0.5;

	const handleOpenPress = () => {
		if (!disabled) {
			bottomSheetRef.current?.expand();
		}
	};
	
	const handleClosePress = useCallback(() => bottomSheetRef.current?.close(), []);
	const handleSelect = (value: string) => {
		setSelectedValue(value);
		onValueChange(value);
		handleClosePress();
	};

	const renderBackdrop = React.useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				onPress={handleClosePress}
				opacity={isDarkMode ? 0.7 : 0.5}
			/>
		),
		[isDarkMode, handleClosePress],
	);


	const selectedLabel = options.find((option) => option.value === selectedValue)?.label || "";

	return (
		<>
			<TouchableOpacity onPress={handleOpenPress} disabled={disabled}>
				<View className="p-3 border border-slate-50 darK:border-slate-800 rounded-md" style={{ opacity: disabled ? 0.5 : 1 }}>
					<Text className="text-slate-400">{label}</Text>
					<Text>{selectedLabel}</Text>
				</View>
			</TouchableOpacity>

			<Portal name="select">
				<BottomSheet
					ref={bottomSheetRef}
					snapPoints={[sheetHeight]}
					index={-1}
					enablePanDownToClose
					backdropComponent={renderBackdrop}
					backgroundStyle={{
						backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
					}}
					handleStyle={{
						backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
					}}
					handleIndicatorStyle={{
						backgroundColor: isDarkMode ? "#555" : "#ccc",
					}}
				>
					<BottomSheetScrollView>
						<View className="flex flex-col gap-y-2 p-3">
							<Heading>{label}</Heading>
							{options.map((option) => (
								<TouchableOpacity key={option.value} onPress={() => handleSelect(option.value)}>
									<Text>{option.label}</Text>
								</TouchableOpacity>
							))}
						</View>
					</BottomSheetScrollView>
				</BottomSheet>
			</Portal>
		</>
	);
};
