import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon, TrashIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMessageByRoomId } from '@/hook/message';
import { useRoomById } from '@/hook/room';
import { colorModeAtom, modalAtom } from '@/store/core';
import { RenderMessages } from '@/types/render';
import { deleteMessageById } from '@/utils/db/message';
import { readRoomFieldById } from '@/utils/db/room';
import { tranceHi, tranceRenderMessages } from '@/utils/message/middleware';
import React from 'react';
import { LogBox, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';
import RenderHtml from 'react-native-render-html';
import { toast } from 'sonner-native';

// Remove @meliorence/react-native-render-html error
if (__DEV__) {
  const ignoreErrors = ['Support for defaultProps will be removed'];

  const error = console.error;
  console.error = (...arg) => {
    for (const error of ignoreErrors) if (arg[0].includes(error)) return;
    error(...arg);
  };
  LogBox.ignoreLogs(ignoreErrors);
}

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
      <ActionBar />
      <DeleteMessageModal />
    </Box>
  );
}

function RenderMessage() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const messages = useMessageByRoomId(Number(id));
  const [corlorMode] = useAtom(colorModeAtom);
  const [renderMessages, setRenderMessages] = React.useState<RenderMessages>();
  const [deleteMessageModal, setDeleteMessageModal] = useAtom(modalAtom('deleteMessage'));
  const [messageId, setMesaageId] = useAtom(messageIdAtom);
  const [characterCover, setCharacterCover] = React.useState<string>();
  React.useEffect(() => {
    const renderMessage = async () => {
      const result = await tranceRenderMessages(corlorMode, messages);
      if (!result) return;
      setRenderMessages(result);
    };
    renderMessage();
  }, [messages]);
  React.useEffect(() => {
    const initCover = async () => {
      const personnel = (await readRoomFieldById(Number(id), 'personnel')) as string[];
      if (!personnel) return;
      const cover = await readRoomFieldById(Number(personnel[0]), 'cover');
      if (!cover) return;
      setCharacterCover(cover as string);
    };
    initCover();
  }, []);
  const handleLongPress = (value: number) => {
    setMesaageId(value);
    setDeleteMessageModal(true);
  };

  return (
    <VStack>
      {renderMessages &&
        renderMessages.map((item) => {
          if (item.is_Sender === 0) {
            return (
              <Menu
                placement="top"
                offset={-20}
                trigger={({ ...triggerProps }) => {
                  return (
                    <Pressable {...triggerProps} key={item.id} className="m-3">
                      <HStack space="md">
                        {characterCover ? (
                          <Image
                            className="w-12 h-12 rounded-full"
                            alt="cover"
                            source={{ uri: characterCover }}
                          />
                        ) : (
                          <Skeleton className="w-12 h-12 rounded-full" />
                        )}
                        <Box className="flex-1  bg-amber-50 dark:bg-stone-900 dark:border-stone-950  p-4 rounded-xl rounded-tl-none border border-amber-200  mr-12">
                          <RenderHtml
                            contentWidth={width}
                            baseStyle={{ color: corlorMode === 'light' ? 'black' : 'white' }}
                            source={{ html: item.content }}
                          />
                        </Box>
                      </HStack>
                    </Pressable>
                  );
                }}>
                <MenuItem
                  onPress={() => handleLongPress(item.id)}
                  key="delete"
                  className="px-2 gap-x-2">
                  <Icon as={TrashIcon} size="sm" className="text-red-500" />
                  <MenuItemLabel>删除</MenuItemLabel>
                </MenuItem>
              </Menu>
            );
          }
          if (item.is_Sender === 1) {
            return (
              <Menu
                placement="top"
                offset={-20}
                trigger={({ ...triggerProps }) => {
                  return (
                    <Pressable {...triggerProps} key={item.id} className="m-3">
                      <HStack className="justify-end">
                        <Box className="flex-1 bg-white dark:bg-slate-900 dark:border-slate-950 p-4 rounded-xl rounded-br-none border border-slate-50 ml-14">
                          <RenderHtml
                            contentWidth={width}
                            baseStyle={{ color: corlorMode === 'light' ? 'black' : 'white' }}
                            source={{ html: item.content }}
                          />
                        </Box>
                      </HStack>
                    </Pressable>
                  );
                }}>
                <MenuItem
                  onPress={() => handleLongPress(item.id)}
                  key="delete"
                  className="px-2 gap-x-2">
                  <Icon as={TrashIcon} size="sm" className="text-red-500" />
                  <MenuItemLabel>删除</MenuItemLabel>
                </MenuItem>
              </Menu>
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

function DeleteMessageModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtom('deleteMessage'));
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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            删除消息
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-typography-500">
            确定删除吗?它将永远离你而去
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setIsOpen(false);
            }}>
            <ButtonText>算了</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={() => {
              handleDelete();
            }}>
            <ButtonText>永别了</ButtonText>
          </Button>
        </ModalFooter>
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
    const content = userInput;
    setUserInput('');
    try {
      setIsLoading(true);
      const result = await tranceHi(content, 'text', room);
      if (!result) throw new Error('发送失败');
    } catch (error) {
      setUserInput(content);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('未知错误');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box className="m-3">
      <HStack space="sm">
        <Input className="flex-1">
          <InputField value={userInput} onChangeText={setUserInput} />
        </Input>
        {isLoading ? (
          <Button className="dark:bg-slate-800">
            <ButtonSpinner className="text-white" />
          </Button>
        ) : (
          <Button isDisabled={userInput.length === 0} onPress={handleHi}>
            <ButtonIcon as={SendIcon} />
          </Button>
        )}
      </HStack>
    </Box>
  );
}
