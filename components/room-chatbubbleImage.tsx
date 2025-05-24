import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
export function ChatBubbleAssistantImage({ gallery }: { gallery: Array<string> }) {
	return (
		<View className="h-64 w-64 mt-2">
			<PagerView
				onStartShouldSetResponder={() => true}
				initialPage={0}
				style={{ height: "100%", width: "100%" }}
				orientation={"horizontal"}
			>
				{gallery.map((item, index) => {
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					return (
						<View key={index as number}>
							<Image
								source={item}
								contentFit={"contain"}
								style={{ height: "100%", width: "100%", alignSelf: "flex-start" }}
								alt="gallery"
							/>
						</View>
					);
				})}
			</PagerView>
		</View>
	);
}
