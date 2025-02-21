import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, Icon, SearchIcon } from '@/components/ui/icon';
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
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCharacterList } from '@/hook/character';
import { modalAtom } from '@/store/modal';
import { createCharacter } from '@/utils/db/character';
import { pickCharacterCover, pickCharacterPng } from '@/utils/file/picker';
import React, { useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Stack, router } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { FileUpIcon, ImportIcon, UserSearchIcon } from 'lucide-react-native';
import { toast } from 'sonner-native';

// 角色卡列表状态
const renderCharacterListAtom = atom<TRenderCharacterList>();

export default function CharacterScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          }
        }}
      />
      <CharacterList />
      <CharacterFab />
      <NewCharacterModal />
      <ImportCharacterModal />
    </>
  );
}

// Header 右侧按钮
function HeaderRight() {
  return <RenderSearchCharacter />;
}

// 渲染搜索的角色卡
function RenderSearchCharacter() {
  const list = useCharacterList();
  const [isPress, setIsPress] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [, setRenderCharacterList] = useAtom(renderCharacterListAtom);
  useEffect(() => {
    if (inputValue.length > 0) {
      const renderList = list.data.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setRenderCharacterList(renderList);
    } else {
      setRenderCharacterList(list.data);
    }
  }, [list.data, inputValue]);

  return (
    <>
      {isPress ? (
        <Input variant="underlined" className="w-[90%] mx-2">
          <InputField
            value={inputValue}
            onBlur={() => setIsPress(false)}
            onChangeText={setInputValue}
            placeholder="搜索"
          />
        </Input>
      ) : (
        <Pressable className="mx-4" onPress={() => setIsPress(true)}>
          {inputValue.length === 0 ? <Icon as={SearchIcon} /> : <Icon as={UserSearchIcon} />}
        </Pressable>
      )}
    </>
  );
}

// 渲染角色卡列表
function CharacterList() {
  const [list] = useAtom(renderCharacterListAtom);
  return (
    <Box className="h-full pt-2 bg-white">
      <ScrollView>
        {list && typeof list != undefined ? (
          <VStack space="sm">
            {list.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/(character)/details/${item.id}`)}
                className="h-20 overflow-hidden">
                <HStack className="flex-1 mx-2" space="md">
                  <Image source={item.cover} alt={item.name} className="h-16 w-16 rounded-full" />
                  <VStack className="flex-1 mx-2">
                    <Text bold>{item.name}</Text>
                    <Text>{item.version}</Text>
                  </VStack>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        ) : (
          <HStack className="h-20 m-2" space="md">
            <Skeleton className="w-16 h-16 rounded-full" />
            <VStack className="m-2" space="md">
              <SkeletonText className="w-20 h-3" />
              <SkeletonText className="w-16 h-2" />
            </VStack>
          </HStack>
        )}
      </ScrollView>
    </Box>
  );
}

// 角色卡Fab
function CharacterFab() {
  const [, setNewCharacterModal] = useAtom(modalAtom('newCharacter'));
  const [, setImportCharacterModal] = useAtom(modalAtom('importCharacter'));
  return (
    <Menu
      placement="top right"
      offset={5}
      disabledKeys={['Settings']}
      trigger={({ ...triggerProps }) => {
        return (
          <Fab size="md" placement="bottom right" {...triggerProps}>
            <FabIcon as={AddIcon} />
          </Fab>
        );
      }}>
      <MenuItem
        key="Add character"
        textValue="Add character"
        onPress={() => setNewCharacterModal(true)}>
        <Icon as={AddIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">新建角色卡</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Import character"
        textValue="Import character"
        onPress={() => setImportCharacterModal(true)}>
        <Icon as={ImportIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">导入角色卡</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

// 新建角色卡模态框 atom:newCharacter
function NewCharacterModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtom('newCharacter'));
  const [name, setName] = React.useState<string>('');
  const [cover, setCover] = React.useState<string | null>(null);

  // 选择封面
  const handleSelectCover = async () => {
    const result = await pickCharacterCover();
    if (!result) return;
    const file = await FileSystem.readAsStringAsync(result.uri, {
      encoding: 'base64'
    });
    const cover = `data:${result.mimeType};base64,${file}`;
    setCover(cover);
  };

  // 保存角色卡
  const handleSave = async () => {
    try {
      if (!cover) return;
      const result = await createCharacter(name, cover);
      if (result) {
        setName('');
        setCover(null);
        setIsOpen(false);
        toast.success('新建角色卡成功: ' + name);
      }
    } catch (e) {
      console.log(e);
    }
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
            新建角色卡
          </Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="md">
            <HStack space="md" className="items-end">
              <VStack className="flex-1" space="sm">
                <Text>取个名字吧</Text>
                <Input>
                  <InputField onChangeText={setName} />
                </Input>
              </VStack>
              <Button variant="link">
                <ButtonText onPress={handleSelectCover}>选择封面</ButtonText>
              </Button>
            </HStack>
            {cover ? <Image className="w-full h-80" source={{ uri: cover }} alt="cover" /> : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setIsOpen(false);
            }}>
            <ButtonText>取消</ButtonText>
          </Button>
          {name.length > 0 && cover != null ? (
            <Button onPress={handleSave}>
              <ButtonText>保存</ButtonText>
            </Button>
          ) : (
            <Button isDisabled>
              <ButtonText>保存</ButtonText>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// 导入角色卡模态框 atom:importCharacter
function ImportCharacterModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtom('importCharacter'));
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>导入角色卡</Heading>
          <Button onPress={pickCharacterPng}>
            <ButtonIcon as={FileUpIcon} />
          </Button>
        </ModalHeader>
        <ModalBody />
        <ModalFooter>
          <Button isDisabled className="w-full">
            <ButtonText>确认导入</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
