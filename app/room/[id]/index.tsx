import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { Messages } from "@/db/schema/message";
import { useCharacterById } from "@/hook/character";
import { useMessageByRoomId } from "@/hook/message";
import { useRoomById } from "@/hook/room";
import { roomOptionsAtom } from "@/store/roomOptions";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import { EllipsisIcon, SendIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const [roomOptions, setRoomOptions] = useAtom(roomOptionsAtom);
  const room = useRoomById(Number(id));
  const character = useCharacterById(Number(room?.personnel?.[0]));
  if (room && character) {
    setRoomOptions({
      assistantaAvatar: character.cover,
      personnel: room.personnel,
    });
  }

  return (
    <Box className="h-full">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          },
        }}
      />
      <MessagesList />
      <ActionBar />
    </Box>
  );
}

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
  if (messages)
    return (
      <Box className="flex-1 p-3">
        <ScrollView>
          <VStack>
            {messages.map((item) => (
              <ChatBubble key={item.id} item={item} />
            ))}
          </VStack>
        </ScrollView>
      </Box>
    );
};

const ChatBubble = ({ item }: { item: Messages }) => {
  const [roomOptions] = useAtom(roomOptionsAtom);
  // Assistant
  if (item.is_Sender === 0) {
    return (
      <Pressable>
        <Box>
          <HStack space="md">
            {roomOptions.assistantaAvatar && (
              <Image
                source={roomOptions.assistantaAvatar}
                alt="AssistantaAvatar"
              />
            )}

            <Box className="max-w-[90%] ">
              <Text>{item.content}</Text>
            </Box>
          </HStack>
        </Box>
      </Pressable>
    );
  }
  // User
  if (item.is_Sender === 1) {
    return (
      <Pressable>
        <Box>
          <HStack className="justify-end">
            <Box>
              <Text>{item.content}</Text>
            </Box>
          </HStack>
        </Box>
      </Pressable>
    );
  }
};

const ActionBar = () => {
  const [userInput, setUserInput] = React.useState<string>();
  return (
    <Box className="p-3">
      <HStack space="sm" className="justify-between items-center">
        <Input className="flex-1 h-auto min-h-[36px] max-h-[200px] overflow-y-auto resize-none">
          <InputField multiline value={userInput} />
        </Input>
        <Button isDisabled={userInput?.length === 0}>
          <ButtonIcon as={SendIcon} />
        </Button>
      </HStack>
    </Box>
  );
};
