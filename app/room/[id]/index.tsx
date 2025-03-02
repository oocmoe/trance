import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMessageByRoomId } from '@/hook/message';
import { useRoomById } from '@/hook/room';
import { modalAtom } from '@/store/core';
import { deleteMessageById } from '@/utils/db/message';
import { readRoomFieldById } from '@/utils/db/room';
import { tranceHi } from '@/utils/message/middleware';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';
import { toast } from 'sonner-native';

const messageIdAtom = atom<number>();

export default function RoomByIdScreen() {
  const { id } = useLocalSearchParams();
  const [background, setBackground] = React.useState<string>();
  React.useEffect(() => {
    const fetchRoomBackground = async () => {
      const result = await readRoomFieldById(Number(id), 'background');
      if (!result) return;
      setBackground(result as string);
    };
    fetchRoomBackground();
  }, [id]);
  return (
    <Box className="h-full">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          }
        }}
      />
      <ScrollView>
        <RenderMessage />
      </ScrollView>
      <MessageModal />
      <ActionBar />
    </Box>
  );
}

function RenderMessage() {
  const { id } = useLocalSearchParams();
  const messages = useMessageByRoomId(Number(id));
  const [messageOptionsModal, setMessageOptionsModal] = useAtom(modalAtom('messageOptions'));
  const [messageId, setMesaageId] = useAtom(messageIdAtom);
  const [characterCover, setCharacterCover] = React.useState<string>();
  const handleLongPress = (value: number) => {
    setMesaageId(value);
    setMessageOptionsModal(true);
  };
  return (
    <VStack>
      {messages &&
        messages.map((item) => {
          if (item.is_Sender === 0) {
            return (
              <Pressable onLongPress={() => handleLongPress(item.id)} key={item.id} className="m-3">
                <HStack space="md">
                  {characterCover ? <Image /> : <Skeleton className="w-12 h-12 rounded-full" />}

                  <Box className="flex-1 bg-amber-50 p-4 rounded-xl rounded-tl-none border border-amber-200  mr-12">
                    <Text>{item.content}</Text>
                  </Box>
                </HStack>
              </Pressable>
            );
          }
          if (item.is_Sender === 1) {
            return (
              <Pressable onLongPress={() => handleLongPress(item.id)} key={item.id} className="m-3">
                <HStack className="justify-end">
                  <Box className="flex-1 bg-white p-4 rounded-xl rounded-br-none border border-slate-50 ml-14">
                    <Text>{item.content}</Text>
                  </Box>
                </HStack>
              </Pressable>
            );
          }
          return null;
        })}
    </VStack>
  );
}

function HeaderRight() {
  const { id } = useLocalSearchParams();
  return (
    <Button onPress={() => router.push(`/room/${id}/detail`)} variant="link">
      <ButtonIcon as={EllipsisIcon} />
    </Button>
  );
}

function MessageModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtom('messageOptions'));
  const [messageId] = useAtom(messageIdAtom);
  const handleDelete = async () => {
    if (!messageId) {
      toast.error('缺少消息id');
      setIsOpen(false);
      return;
    }
    const result = await deleteMessageById(messageId);
    if (!result) {
      toast.error('删除失败');
      return;
    }
    setIsOpen(false);
    toast.success('删除成功');
  };
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalBackdrop />
      <ModalContent>
        <Button onPress={handleDelete} variant="link">
          <ButtonText className="text-red-400">删除</ButtonText>
        </Button>
      </ModalContent>
    </Modal>
  );
}

function ActionBar() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const room = useRoomById(Number(id));
  const [userInput, setUserInput] = React.useState<string>('');

  const handleHi = async () => {
    setIsLoading(true);
    const result = await tranceHi(userInput, 'text', room);
    setUserInput('');
    if (!result) {
      toast.error('发送失败');
    }
    setIsLoading(false);
  };
  return (
    <Box className="m-3">
      <HStack space="sm">
        <Input className="flex-1">
          <InputField value={userInput} onChangeText={setUserInput} />
        </Input>
        {isLoading ? (
          <Button onPress={handleHi}>
            <ButtonSpinner className="text-white" />
          </Button>
        ) : (
          <Button onPress={handleHi}>
            <ButtonIcon as={SendIcon} />
          </Button>
        )}
      </HStack>
    </Box>
  );
}
