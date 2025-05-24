import type { TranceRoomTheme } from "@/types/trance.types";

export const TRANCE_THEME_PROFILE_GREEN: TranceRoomTheme = {
	profile: {
		name: "trance Green Theme",
		creator: "trance",
		version: "0.9.0",
	},
	light: {
		stackOptions: {
			headerShown: true,
			headerTitleAlign: "center",
			headerTintColor: "#000000",
			headerStyle: {
				backgroundColor: "#ededed",
			},
			contentStyle: {
				backgroundColor: "#ededed",
			},
		},
		imageBackground: {
			render: "none",
			customImage: "",
			blurRadius: 50,
			backgroundStyle: {
				height: "100%",
				width: "100%",
			},
			overlay: {},
		},
		roomFloor: {
			sender0: {
				flexDirection: "row",
				maxWidth: "70%",
				alignItems: "flex-start",
				gap: 8,
				margin: 8,
			},
			sender1: {
				flexDirection: "row",
				gap: 8,
				maxWidth: "80%",
				justifyContent: "flex-end",
				marginLeft: "20%",
				margin: 8,
			},
		},
		avatar: {
			is_ShowUserAvatar: true,
			is_ShowAssistantAvatar: true,
			user: {
				height: 40,
				width: 40,
				borderRadius: 6,
			},
			assistant: {
				height: 40,
				width: 40,
				borderRadius: 6,
			},
		},
		chatBubble: {
			user: {
				bubble: {
					padding: 16,
					borderRadius: 8,
					backgroundColor: "#95ec69",
				},
				bubbleText: {
					color: "black",
				},
				bubbleQuoteText: {},
			},
			assistant: {
				bubble: {
					backgroundColor: "#fff",
					padding: 16,
					borderRadius: 8,
				},
				bubbleText: {
					color: "black",
				},
				bubbleQuoteText: {
					fontWeight: "bold",
					color: "black",
				},
			},
		},
		actionBar: {
			ActionBarStyle: {
				backgroundColor:  "#f7f7f7",
				padding: 10,
			},
			SendButton: {
				buttonStyle: {
					backgroundColor:  "#07c160",
					paddingHorizontal: 12,
					paddingVertical: 10,
					borderRadius: 8,
				},
				buttonText: "发送",
				buttonTextStyle: {
					color: "white",
				},
				buttonIconStyle: {},
				is_ShowIcon: false,
				is_ShowText: true,
			},
			TextInputStyle: {},
		},
	},
	dark: {
		stackOptions: {
			headerShown: true,
			headerTintColor: "#cfcfcf",
			headerTitleAlign: "center",
			headerStyle: {
				backgroundColor: "#000000",
			},
			contentStyle: {
				backgroundColor: "#000000",
			},
		},
		imageBackground: {
			render: "none",
			customImage: "",
			blurRadius: 50,
			backgroundStyle: {
				height: "100%",
				width: "100%",
			},
			overlay: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0,0,0,0.7)",
			},
		},
		roomFloor: {
			sender0: {
				flexDirection: "row",
				maxWidth: "70%",
				alignItems: "flex-start",
				gap: 8,
				margin: 8,
			},
			sender1: {
				flexDirection: "row",
				gap: 8,
				maxWidth: "80%",
				justifyContent: "flex-end",
				marginLeft: "20%",
				margin: 8,
			},
		},
		avatar: {
			is_ShowUserAvatar: true,
			is_ShowAssistantAvatar: true,
			user: {
				height: 40,
				width: 40,
				borderRadius: 6,
			},
			assistant: {
				height: 40,
				width: 40,
				borderRadius: 6,
			},
		},
		chatBubble: {
			user: {
				bubble: {
					padding: 16,
					borderRadius: 10,
					backgroundColor: "#3eb575",
				},
				bubbleText: {
					color: "white",
				},
				bubbleQuoteText: {},
			},
			assistant: {
				bubble: {
					backgroundColor: "#2c2c2c",
					padding: 16,
					borderRadius: 10,
				},
				bubbleText: {
					color: "white",
				},
				bubbleQuoteText: {
					fontWeight: "bold",
					color: "white",
				},
			},
		},
		actionBar: {
			ActionBarStyle: {
				backgroundColor: "#1e1e1e",
				padding: 10,
				borderTopRightRadius: 10,
				borderTopLeftRadius: 10,
			},
			SendButton: {
				buttonStyle: {
					backgroundColor: "#07c160",
					paddingHorizontal: 12,
					paddingVertical: 10,
					borderRadius: 8,
				},
				buttonText: "发送",
				buttonTextStyle: {
					color: "white",
				},
				buttonIconStyle: {},
				is_ShowIcon: false,
				is_ShowText: true,
			},
			TextInputStyle: {
				backgroundColor:"#292929"
			},
		},
	},
};
