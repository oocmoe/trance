import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonSpinner } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Messages } from "@/db/schema/message";
import { useCharacterById } from "@/hook/character";
import { useMessageByRoomId } from "@/hook/message";
import { useRoomById } from "@/hook/room";
import { useThemeRoomOptions } from "@/hook/theme";
import { type RoomOptions, roomOptionsAtom } from "@/store/roomOptions";
import { createMessage } from "@/utils/db/message";
import { tranceHi } from "@/utils/message/middleware";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import { EllipsisIcon, SendIcon } from "lucide-react-native";
import React from "react";
import { Image, ScrollView } from "react-native";
import { toast } from "sonner-native";

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const [roomOptions, setRoomOptions] = useAtom(roomOptionsAtom);
  const themeRoomOptions = useThemeRoomOptions();
  const room = useRoomById(Number(id));
  React.useEffect(() => {
    if (room) {
      setRoomOptions({
        id: Number(id),
        model: room.model,
        prompt: room.prompt,
        personnel: room.personnel,
      });
    }
  }, [id, room, setRoomOptions]);
  console.log(roomOptions);
  if (room)
    return (
      <Box className="h-full">
        <Stack.Screen
          options={{
            ...themeRoomOptions?.screenOptions,
            title: room.name,
            headerRight: () => {
              return <HeaderRight />;
            },
          }}
        />
        <MessagesList />
        <ActionBar />
      </Box>
    );
  return <RoomSkeleton />;
}

const RoomSkeleton = () => {
  return (
    <Box className="h-full">
      <Skeleton className="h-full" />
    </Box>
  );
};

const HeaderRight = () => {
  const { id } = useLocalSearchParams();
  return (
    <Button onPress={() => router.push(`/room/${id}/detail`)} variant="link">
      <ButtonIcon as={EllipsisIcon} />
    </Button>
  );
};

const MessagesList = () => {
  const { id } = useLocalSearchParams();
  const messages = useMessageByRoomId(Number(id));
  const scrollViewRef = React.useRef<ScrollView>(null);
  React.useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 100);
  }, []);
  if (messages)
    return (
      <ScrollView ref={scrollViewRef}>
        <Box className="flex-1 p-3">
          <VStack space="md">
            {messages.map((item) => (
              <ChatBubble key={item.id} item={item} />
            ))}
          </VStack>
        </Box>
      </ScrollView>
    );
};

const ChatBubble = ({ item }: { item: Messages }) => {
  const [roomOptions] = useAtom(roomOptionsAtom);
  const [assistantaAvatar, setAssistantaAvatar] = React.useState<string>();
  const themeRoomOptions = useThemeRoomOptions();
  if (roomOptions.personnel) {
    const character = useCharacterById(Number(roomOptions.personnel[0]));
    React.useEffect(() => {
      setAssistantaAvatar(character?.cover);
    }, [character]);
  }
  // Assistant
  if (item.is_Sender === 0) {
    return (
      <Box>
        <HStack className="max-w-[80%]" space="md">
          {assistantaAvatar ? (
            <Image
              source={{ uri: assistantaAvatar }}
              alt="avatar"
              style={themeRoomOptions?.componentOptions.assistantAvatar}
            />
          ) : (
            <Skeleton
              style={themeRoomOptions?.componentOptions.assistantAvatar}
            />
          )}

          <Box style={themeRoomOptions?.componentOptions.assistantChatBubble}>
            <Text
              style={themeRoomOptions?.componentOptions.assistantChatBubbleText}
            >
              {item.content}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  }
  // User
  if (item.is_Sender === 1) {
    return (
      <Box>
        <HStack className="max-w-[75%] self-end">
          <Box style={themeRoomOptions?.componentOptions.userChatBubble}>
            <Text style={themeRoomOptions?.componentOptions.userChatBubbleText}>
              {item.content}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  }
};

const ActionBar = () => {
  const [userInput, setUserInput] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [roomOptions] = useAtom(roomOptionsAtom);
  const handleSayHi = async () => {
    try {
      setIsLoading(true);
      if (!userInput) throw new Error("输入内容不能为空");
      if (!roomOptions.id) throw new Error("房间未初始化");
      const saveUserInputResult = await createMessage(
        roomOptions.id,
        "text",
        1,
        userInput,
        "user",
      );
      if (!saveUserInputResult) throw new Error("保存用户输入失败");
      const result = await tranceHi(
        userInput,
        "text",
        roomOptions as RoomOptions,
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error("未知错误");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box className="p-3">
      <HStack space="sm" className="justify-between items-center">
        <Input className="flex-1 h-auto min-h-[36px] max-h-[200px] overflow-y-auto resize-none">
          <InputField multiline value={userInput} />
        </Input>
        <Button
          onPress={handleSayHi}
          isDisabled={userInput?.length === 0 || isLoading}
        >
          {isLoading ? <ButtonSpinner /> : <ButtonIcon as={SendIcon} />}
        </Button>
      </HStack>
    </Box>
  );
};
