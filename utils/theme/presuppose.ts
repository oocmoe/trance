import { type TranceTheme, defaultThemeOptions } from "@/store/theme";

export const themeDefaultConfig: TranceTheme = defaultThemeOptions;

export const themeDefaultGreenConfig: TranceTheme = {
	light: {
		Drawer: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				sceneStyle: {
					backgroundColor: "#ededed",
				},
				drawerInactiveTintColor: "#000000",
				drawerStyle: {
					width: 300,
					backgroundColor: "#ffffff",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				contentStyle: {
					backgroundColor: "#ededed",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				contentStyle: {
					backgroundColor: "#ededed",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: false,
				is_UserAvatarShow: true,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#f7f7f7",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				assistantChatBubble: {
					backgroundColor: "#ffffff",
					padding: 16,
					borderRadius: 4,
				},
				assistantChatBubbleText: {
					color: "#000000",
				},
				assistantChatBubbleHighlightText: {
					color: "#000000",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#07c160",
				},
				sendButtonText: {
					color: "#ffffff",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				userChatBubbleText: {
					color: "#000000",
					fontWeight: "bold",
				},
				userChatBubbleHighlightText: {
					color: "#f59e0b",
				},
				userChatBubble: {
					backgroundColor: "#ffffff",
					padding: 8,
					borderRadius: 4,
				},
			},
		},
	},
	dark: {
		Drawer: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				sceneStyle: {
					backgroundColor: "#191919",
				},
				drawerInactiveTintColor: "#ffffff",
				drawerStyle: {
					width: 300,
					backgroundColor: "#242424",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#111111",
				},
				contentStyle: {
					backgroundColor: "#242424",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: false,
				is_UserAvatarShow: true,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#1e1e1e",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				assistantChatBubble: {
					backgroundColor: "#2c2c2c",
					padding: 16,
					borderRadius: 4,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
				},
				assistantChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#07c160",
				},
				sendButtonText: {
					color: "#ffffff",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				userChatBubbleText: {
					color: "#000000",
				},
				userChatBubbleHighlightText: {
					color: "#000000",
					fontWeight: "bold",
				},
				userChatBubble: {
					backgroundColor: "#3eb575",
					padding: 16,
					borderRadius: 4,
				},
			},
		},
	},
};

export const themeDefaultPeachConfig: TranceTheme = {
	light: {
		Drawer: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#fb92a6",
				},
				sceneStyle: {
					backgroundColor: "#ffffff",
				},
				drawerStyle: {
					width: 300,
					backgroundColor: "#4c5b70",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
				drawerInactiveTintColor: "#ffffff",
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#fb92a6",
				},
				contentStyle: {
					backgroundColor: "#f1f5f6",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#fb92a6",
				},
				contentStyle: {
					backgroundColor: "#ffffff",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: true,
				is_UserAvatarShow: false,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#f1f5f6",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 100,
				},
				assistantChatBubble: {
					backgroundColor: "#4f5a6e",
					padding: 8,
					borderRadius: 6,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				assistantChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				assistantName: {
					color: "#404040",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#fb92a6",
				},
				userInputField: {
					borderColor: "#f1f5f6",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 100,
				},
				userChatBubble: {
					backgroundColor: "#4989c5",
					padding: 8,
					borderRadius: 6,
				},
				userChatBubbleText: {
					color: "#ffffff",
				},
				userChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
			},
		},
	},
	dark: {
		Drawer: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				sceneStyle: {
					backgroundColor: "#191919",
				},
				drawerInactiveTintColor: "#ffffff",
				drawerStyle: {
					width: 300,
					backgroundColor: "#242424",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#111111",
				},
				contentStyle: {
					backgroundColor: "#242424",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: true,
				is_UserAvatarShow: false,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#1e1e1e",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 8,
				},
				assistantChatBubble: {
					backgroundColor: "#2c2c2c",
					padding: 16,
					borderRadius: 8,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
				},
				assistantChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#07c160",
				},
				sendButtonText: {
					color: "#ffffff",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 8,
				},
				userChatBubbleText: {
					color: "#000000",
				},
				userChatBubbleHighlightText: {
					color: "#000000",
					fontWeight: "bold",
				},
				userChatBubble: {
					backgroundColor: "#3eb575",
					padding: 16,
					borderRadius: 8,
				},
			},
		},
	},
};

export const themeDefaultPomeloThemeConfig: TranceTheme = {
	light: {
		Drawer: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#fff7e1",
				},
				sceneStyle: {
					backgroundColor: "#ffffff",
				},
				drawerInactiveTintColor: "#000000",
				drawerStyle: {
					width: 300,
					backgroundColor: "#ffffff",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#fff7e1",
				},
				contentStyle: {
					backgroundColor: "#ffffff",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#fff7e1",
				},
				contentStyle: {
					backgroundColor: "#fff7e1",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: true,
				is_UserAvatarShow: false,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#ffffff",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 100,
				},
				assistantChatBubble: {
					backgroundColor: "#4c5b70",
					padding: 8,
					borderRadius: 6,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				assistantChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#ffffff",
				},
				sendButtonIcon: {
					color: "#596777",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 100,
				},
				userChatBubble: {
					backgroundColor: "#4a8aca",
					padding: 8,
					borderRadius: 6,
				},
				userChatBubbleText: {
					color: "#ffffff",
				},
				userChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
			},
		},
	},
	dark: {
		Drawer: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				sceneStyle: {
					backgroundColor: "#191919",
				},
				drawerInactiveTintColor: "#ffffff",
				drawerStyle: {
					width: 300,
					backgroundColor: "#242424",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		Stack: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#111111",
				},
				contentStyle: {
					backgroundColor: "#242424",
				},
			},
		},
		Room: {
			options: {
				headerTitleAlign: "center",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
			profile: {
				is_AssistantAvatarShow: true,
				is_AssistantNameShow: true,
				is_UserAvatarShow: false,
				is_UserNameShow: false,
			},
			componentStyle: {
				actionBar: {
					backgroundColor: "#1e1e1e",
				},
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 8,
				},
				assistantChatBubble: {
					backgroundColor: "#2c2c2c",
					padding: 16,
					borderRadius: 8,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
				},
				assistantChatBubbleHighlightText: {
					color: "#ffffff",
					fontWeight: "bold",
				},
				sendButton: {
					backgroundColor: "#07c160",
				},
				sendButtonText: {
					color: "#ffffff",
				},
				userAvatar: {
					width: 40,
					height: 40,
					borderRadius: 8,
				},
				userChatBubbleText: {
					color: "#000000",
				},
				userChatBubbleHighlightText: {
					color: "#000000",
					fontWeight: "bold",
				},
				userChatBubble: {
					backgroundColor: "#3eb575",
					padding: 16,
					borderRadius: 8,
				},
			},
		},
	},
};
