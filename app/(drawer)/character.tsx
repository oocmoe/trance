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
import { modalAtom } from '@/store/core';
import { ConvertCharacterResult } from '@/types/result';
import { createCharacter, createImportCharacter } from '@/utils/db/character';
import { pickCharacterCover, pickCharacterPng } from '@/utils/file/picker';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Stack, router } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { CircleCheckBigIcon, FileUpIcon, ImportIcon, UserSearchIcon } from 'lucide-react-native';
import { toast } from 'sonner-native';

// 角色卡列表状态
const renderCharacterListAtom = atom<RenderCharacterList>();

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
      <Box className="h-full p-2 bg-white dark:bg-slate-950">
        <CharacterList />
      </Box>
      <CharacterFab />
      <NewCharacterModal />
      <ImportCharacterModal />
    </>
  );
}

// Header 右侧按钮
function HeaderRight() {
  return <SearchCharacter />;
}

// 渲染搜索的角色卡
function SearchCharacter() {
  const list = useCharacterList();
  const [isPress, setIsPress] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [, setRenderCharacterList] = useAtom(renderCharacterListAtom);
  React.useEffect(() => {
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
    <ScrollView>
      {list && typeof list != undefined ? (
        <VStack space="sm">
          {list.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/character/${item.id}`)}
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
  const [name, setName] = React.useState<string>();
  const [cover, setCover] = React.useState<string>();

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
    if (!cover || !name) return;
    const result = await createCharacter(name, cover);
    if (result) {
      setName(undefined);
      setCover(undefined);
      setIsOpen(false);
      toast.success('新建角色卡成功: ' + name);
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
            {cover && <Image className="w-full h-80" source={{ uri: cover }} alt="cover" />}
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
          <Button onPress={handleSave} isDisabled={name?.length === 0 || !cover}>
            <ButtonText>保存</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// 导入角色卡模态框 atom:importCharacter
function ImportCharacterModal() {
  const [isOpen, setIsOpen] = useAtom(modalAtom('importCharacter'));
  const [previewData, setPreviewData] = React.useState<ConvertCharacterResult>();
  const handleImportCharacterPng = async () => {
    const result = await pickCharacterPng();
    if (!result) {
      toast.error('读取角色卡失败,请检查是否为角色卡文件');
    }
    setPreviewData(result);
  };
  const handleImport = async () => {
    if (!previewData) return;
    const result = await createImportCharacter(previewData.character);
    if (!result) {
      toast.error('导入角色卡失败');
      setPreviewData(undefined);
      return;
    }
    toast.success('导入角色卡成功');
    setPreviewData(undefined);
    setIsOpen(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false), setPreviewData(undefined);
      }}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>导入角色卡</Heading>
          <Button onPress={handleImportCharacterPng}>
            <ButtonIcon as={FileUpIcon} />
          </Button>
        </ModalHeader>
        <ModalBody>
          {previewData && previewData.character.cover && (
            <Box>
              <HStack space="sm">
                <Image
                  className="h-32 object-cover"
                  source={{ uri: previewData.character.cover }}
                  alt={previewData.character.name}
                />
                <VStack space="sm">
                  <Heading>{previewData.character.name}</Heading>
                  <Box>
                    {previewData.character && (
                      <HStack space="sm" className="items-center">
                        <Icon color="green" as={CircleCheckBigIcon} />
                        <Text>角色卡数据</Text>
                      </HStack>
                    )}
                  </Box>
                </VStack>
              </HStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" onPress={handleImport} isDisabled={!previewData}>
            <ButtonText>确认导入</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
