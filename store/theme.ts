import { Storage } from "expo-sqlite/kv-store";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

type HexColor = `#${string}`;

type ThemeStackOptions = {
  headerTitleAlign: "left" | "center";
  headerTintColor: HexColor;
  headerStyle: {
    backgroundColor: HexColor;
  };
  contentStyle: {
    backgroundColor: HexColor;
  };
};

type ThemeStack = {
  light: {
    screenOptions: ThemeStackOptions;
  };
  dark: {
    screenOptions: ThemeStackOptions;
  };
};

type ThemeDrawerOptions = {
  headerTintColor: HexColor;
  headerTitleAlign: "left" | "center";
  headerStyle: {
    backgroundColor: HexColor;
  };
  sceneStyle: {
    backgroundColor: HexColor;
  };
  drawerStyle: {
    backgroundColor: HexColor;
    borderTopEndRadius: number;
    borderBottomEndRadius: number;
  };
};

type ThemeDrawer = {
  light: {
    screenOptions: ThemeDrawerOptions;
  };
  dark: {
    screenOptions: ThemeDrawerOptions;
  };
};

type ThemeRoomStackOptions = {
  headerTitleAlign: "left" | "center";
  headerTintColor: HexColor;
  headerStyle: {
    backgroundColor: HexColor;
  };
  contentStyle: {
    backgroundColor: HexColor;
  };
};

type ThemeRoomassistantAvatar = {
  width: number;
  height: number;
  borderRadius?: number;
  borderTopStartRadius?: number;
  borderTopEndRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomEndRadius?: number;
};

type ThemeRoomChatBubble = {
  backgroundColor: HexColor;
  padding?: number;
  borderRadius?: number;
  borderTopStartRadius?: number;
  borderTopEndRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomEndRadius?: number;
};

type ThemeRoomAssistantChatBubbleText = {
  fontSize?: number;
  color?: HexColor;
};

type ThemeRoomUserChatBubbleText = {
  fontSize?: number;
  color?: HexColor;
};

type ThemeRoom = {
  light: {
    screenOptions: ThemeRoomStackOptions;
    componentOptions: {
      assistantAvatar: ThemeRoomassistantAvatar;
      assistantChatBubble: ThemeRoomChatBubble;
      assistantChatBubbleText?: ThemeRoomAssistantChatBubbleText;
      userChatBubble: ThemeRoomChatBubble;
      userChatBubbleText?: ThemeRoomUserChatBubbleText;
    };
  };
  dark: {
    screenOptions: ThemeRoomStackOptions;
    componentOptions: {
      assistantAvatar: ThemeRoomassistantAvatar;
      assistantChatBubble: ThemeRoomChatBubble;
      assistantChatBubbleText?: ThemeRoomAssistantChatBubbleText;
      userChatBubble: ThemeRoomChatBubble;
      userChatBubbleText?: ThemeRoomUserChatBubbleText;
    };
  };
};

export type ThemeOptions = {
  stackOptions: ThemeStack;
  drawerOptions: ThemeDrawer;
  roomOptions: ThemeRoom;
};

const defaultStackOptions: ThemeStack = {
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
};

const defaultDrawerOptions: ThemeDrawer = {
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
};

const defaultRoomOptions: ThemeRoom = {
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
      },
      assistantChatBubble: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
      },
      assistantChatBubbleText: {
        color: "#ffffff",
      },
      userChatBubble: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
      },
      userChatBubbleText: {
        color: "#ffffff",
      },
    },
  },
  dark: {
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
};

export const colorModeAtom = atom<"light" | "dark">("dark");

export const themeStackOptionsAtom = atomWithStorage<ThemeStack>(
  "TRANCE_THEME_STACK",
  defaultStackOptions,
  createJSONStorage<ThemeStack>(() => Storage),
);

export const themeDrawerOptionsAtom = atomWithStorage<ThemeDrawer>(
  "TRANCE_THEME_DRAWER",
  defaultDrawerOptions,
  createJSONStorage<ThemeDrawer>(() => Storage),
);

export const themeRoomOptionsAtom = atomWithStorage<ThemeRoom>(
  "TRANCE_THEME_ROOM",
  defaultRoomOptions,
  createJSONStorage<ThemeRoom>(() => Storage),
);
