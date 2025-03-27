import type { ThemeOptions } from "@/store/theme";

export const themeDefault: ThemeOptions = {
	stackOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ffffff",
				},
				contentStyle: {
					backgroundColor: "#ffffff",
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
		},
	},
	drawerOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ffffff",
				},
				sceneStyle: {
					backgroundColor: "#ffffff",
				},
				drawerStyle: {
					backgroundColor: "#ffffff",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#000000",
				},
				sceneStyle: {
					backgroundColor: "#000000",
				},
				drawerStyle: {
					backgroundColor: "#000000",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
	},
	roomOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				contentStyle: {
					backgroundColor: "#ededed",
				},
			},
			componentOptions: {
				assistantAvatar: {
					width: 48,
					height: 48,
					borderRadius: 100,
				},
				assistantChatBubble: {
					backgroundColor: "#ffffff",
					padding: 16,
					borderRadius: 16,
				},
				assistantChatBubbleText: {
					color: "#000000",
				},
				userChatBubble: {
					backgroundColor: "#ffffff",
					padding: 16,
					borderRadius: 16,
				},
				userChatBubbleText: {
					color: "#000000",
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#ffffff",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
			componentOptions: {
				assistantAvatar: {
					width: 48,
					height: 48,
				},
				assistantChatBubble: {
					backgroundColor: "#000000",
					padding: 16,
					borderRadius: 16,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
				},
				userChatBubble: {
					backgroundColor: "#000000",
					padding: 16,
					borderRadius: 16,
				},
				userChatBubbleText: {
					color: "#ffffff",
				},
			},
		},
	},
};

export const themeDefaultGreen: ThemeOptions = {
	stackOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				contentStyle: {
					backgroundColor: "#ededed",
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#111111",
				},
				contentStyle: {
					backgroundColor: "#242424",
				},
			},
		},
	},
	drawerOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				sceneStyle: {
					backgroundColor: "#ededed",
				},
				drawerStyle: {
					backgroundColor: "#ffffff",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				sceneStyle: {
					backgroundColor: "#191919",
				},
				drawerStyle: {
					backgroundColor: "#242424",
					borderTopEndRadius: 0,
					borderBottomEndRadius: 0,
				},
			},
		},
	},
	roomOptions: {
		light: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#000000",
				headerStyle: {
					backgroundColor: "#ededed",
				},
				contentStyle: {
					backgroundColor: "#ededed",
				},
			},
			componentOptions: {
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				assistantChatBubble: {
					backgroundColor: "#ffffff",
					padding: 16,
					borderRadius: 8,
				},
				assistantChatBubbleText: {
					color: "#000000",
				},
				userChatBubble: {
					backgroundColor: "#95ec69",
					padding: 16,
					borderRadius: 8,
				},
				userChatBubbleText: {
					color: "#000000",
				},
			},
		},
		dark: {
			screenOptions: {
				headerTitleAlign: "left",
				headerTintColor: "#cfcfcf",
				headerStyle: {
					backgroundColor: "#000000",
				},
				contentStyle: {
					backgroundColor: "#000000",
				},
			},
			componentOptions: {
				assistantAvatar: {
					width: 40,
					height: 40,
					borderRadius: 4,
				},
				assistantChatBubble: {
					backgroundColor: "#2c2c2c",
					padding: 16,
					borderRadius: 8,
				},
				assistantChatBubbleText: {
					color: "#ffffff",
				},
				userChatBubble: {
					backgroundColor: "#3eb575",
					padding: 16,
					borderRadius: 8,
				},
				userChatBubbleText: {
					color: "#000000",
				},
			},
		},
	},
};
