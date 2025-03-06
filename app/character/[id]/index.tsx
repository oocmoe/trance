import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@/components/ui/modal';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCharacterDetailsById } from '@/hook/character';
import { deleteCharacter } from '@/utils/db/character';
import { createDialogRoom } from '@/utils/db/room';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MessageCirclePlusIcon, Trash2Icon } from 'lucide-react-native';
import { toast } from 'sonner-native';

export default function CharacterByIdScreen() {
  return (
    <>
      <IDCard />
      <Action />
    </>
  );
}

/**
 * 角色卡基本信息
 * @returns
 */
function IDCard() {
  const character = useCharacterDetailsById();
  return (
    <>
      {character && (
        <Card variant="filled" className="m-3">
          <HStack space="md">
            <Box>
              <Image
                source={character.cover}
                alt={character.name}
                className="aspect-[3/4] h-48 rounded-sm"
              />
            </Box>
            <VStack>
              <Box>
                <Heading>{character.name}</Heading>
                <Text>{character.version}</Text>
                <Text>{character.creator}</Text>
              </Box>
            </VStack>
          </HStack>
        </Card>
      )}
    </>
  );
}

/**
 * 对角色卡的行为列表
 * @returns
 *
 */
function Action() {
  return (
    <Box className="m-3">
      <VStack space="sm">
        <Text>选项</Text>
        <Card variant="filled">
          <ScrollView>
            <VStack space="4xl">
              <CreateRoom />
              <DeleteCharacter />
            </VStack>
          </ScrollView>
        </Card>
      </VStack>
    </Box>
  );
}

/**
 * 创建聊天
 * @returns
 */
function CreateRoom() {
  const character = useCharacterDetailsById();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>();
  const [prologue, setPrologue] = React.useState<number>();
  // 初始化数据
  React.useEffect(() => {
    if (!character) return;
    setName(character.name);
  }, [character]);

  // 创建聊天
  const handleCreateDialogRoom = async () => {
    if (!name) {
      toast.warning('聊天名称不能为空');
      return;
    }
    const result = await createDialogRoom(character.id, name, prologue);
    if (result) {
      setIsOpen(false);
      toast.success('创建聊天成功');
    } else {
      setIsOpen(false);
      toast.error('创建聊天失败');
    }
  };
  return (
    <>
      <Pressable onPress={() => setIsOpen(true)}>
        <HStack className="items-center" space="md">
          <Icon as={MessageCirclePlusIcon} />
          <Heading>创建新聊天</Heading>
        </HStack>
      </Pressable>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>创建新聊天</Heading>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Box>
                <Text>聊天名称</Text>
                <Input>
                  <InputField value={name} />
                </Input>
              </Box>
              {character?.prologue && character.prologue.length > 0 ? (
                <Box>
                  <Text>开场白</Text>
                  <Select onValueChange={(value) => setPrologue(Number(value))}>
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="选择一个开场白" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {character.prologue.map((item, index) => (
                          <SelectItem key={index} value={String(index)} label={item.name} />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Box>
              ) : (
                <Text>当前角色卡无开场白</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => setIsOpen(false)}
              className="flex-grow">
              <ButtonText>取消</ButtonText>
            </Button>
            <Button onPress={handleCreateDialogRoom} size="sm" className="flex-grow">
              <ButtonText>创建新聊天</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * 删除角色卡
 * @returns
 */
function DeleteCharacter() {
  const { id } = useLocalSearchParams();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // 删除角色卡方法
  const handleDelte = async () => {
    const result = await deleteCharacter(Number(id));
    if (result) {
      setIsOpen(false);
      router.push('/(drawer)/character');
      toast.success('删除成功');
    } else {
      setIsOpen(false);
      toast.error('删除失败');
    }
  };
  return (
    <>
      <Pressable onPress={() => setIsOpen(true)}>
        <HStack className="items-center" space="md">
          <Icon as={Trash2Icon} />
          <Heading>删除角色卡</Heading>
        </HStack>
      </Pressable>
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[48px] h-[48px] rounded-full items-center justify-center">
              <Icon as={Trash2Icon} className="stroke-error-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
              删除角色卡
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
              它将永远离你而去,你下定决心了吗
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => setIsOpen(false)}
              className="flex-grow">
              <ButtonText>算了</ButtonText>
            </Button>
            <Button action="negative" onPress={handleDelte} size="sm" className="flex-grow">
              <ButtonText>永别了</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
