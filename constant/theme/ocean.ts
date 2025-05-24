import type { TranceRoomTheme } from "@/types/trance.types";

export const TRANCE_THEME_PROFILE_OCEAN: TranceRoomTheme = {
	profile: {
		name: "trance Ocean Theme",
		creator: "trance",
		version: "0.9.0",
	},
	light: {
		stackOptions: {
			headerShown: false,
			headerStyle: {
				backgroundColor: "#fb92a6",
			},
			headerTintColor: "#fff",
			contentStyle: {
				backgroundColor: "#fff",
			},
		},
		imageBackground: {
			render: "character",
			customImage: "",
			blurRadius: 1,
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
				backgroundColor: "rgba(0,0,0,0.1)",
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
			is_ShowUserAvatar: false,
			is_ShowAssistantAvatar: true,
			user: {
				height: 40,
				width: 40,
				borderRadius: 10,
			},
			assistant: {
				height: 40,
				width: 40,
				borderRadius: 100,
			},
		},
		chatBubble: {
			user: {
				bubble: {
					padding: 12,
					borderRadius: 8,
					backgroundColor: "#76c6fe",
				},
				bubbleText: {
					color: "white",
				},
				bubbleQuoteText: {
					color:'white',
					fontWeight: "bold",
				},
			},
			assistant: {
				bubble: {
					backgroundColor: "#fbf6f7",
					padding: 12,
					borderRadius: 8,
				},
				bubbleText: {
					color: "#48494b",
				},
				bubbleQuoteText: {
					fontWeight: "bold",
					color: "#525456",
				},
			},
		},
		actionBar: {
			ActionBarStyle: {
				backgroundColor: "#f3f5f7",
				padding: 10,
				borderTopRightRadius: 10,
				borderTopLeftRadius: 10,
			},
			SendButton: {
				buttonStyle: {
					backgroundColor: "#76c6fe",
					paddingHorizontal: 12,
					paddingVertical: 10,
					borderRadius: 8,
				},
				buttonText: "",
				buttonTextStyle: {
					color: "white",
				},
				buttonIconStyle: {
					color:"white"
				},
				is_ShowIcon: true,
				is_ShowText: false,
			},
			TextInputStyle: {},
		},
	},
	dark: {
		stackOptions: {
			headerShown: false,
			headerStyle: {
				backgroundColor: "#fff",
			},
			contentStyle: {
				backgroundColor: "#fff",
			},
		},
		imageBackground: {
			render: "character",
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
				borderRadius: 10,
			},
			assistant: {
				height: 40,
				width: 40,
				borderRadius: 10,
			},
		},
		chatBubble: {
			user: {
				bubble: {
					padding: 16,
					borderRadius: 10,
					backgroundColor: "#4c1d95",
				},
				bubbleText: {
					color: "white",
				},
				bubbleQuoteText: {},
			},
			assistant: {
				bubble: {
					backgroundColor: "#020618",
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
				backgroundColor: "#000",
				padding: 10,
				borderTopRightRadius: 10,
				borderTopLeftRadius: 10,
			},
			SendButton: {
				buttonStyle: {
					backgroundColor: "#5b21b6",
					paddingHorizontal: 12,
					paddingVertical: 10,
					borderRadius: 8,
				},
				buttonText: "",
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
};
