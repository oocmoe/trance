import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  AddIcon,
  ArrowRightIcon,
  Icon,
  SearchIcon,
} from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePromptList } from "@/hook/prompt";
import { modalAtom } from "@/store/core";
import type { RenderPromptList } from "@/types/render";
import type { ConverPromptResult } from "@/types/result";
import { createImportPrompt } from "@/utils/db/prompt";
import { pickPrompt } from "@/utils/file/picker";
import { Stack, router } from "expo-router";
import { atom, useAtom } from "jotai";
import {
  FileUpIcon,
  HammerIcon,
  ImportIcon,
  ScanSearchIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";

const renderPromptListAtom = atom<RenderPromptList>();

export default function PromptScreen() {
  return (
    <Box className="h-full p-3">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          },
        }}
      />
      <PromptList />
      <PromptFab />
      <ImportPromptModal />
    </Box>
  );
}

function HeaderRight() {
  return <SearchPrompt />;
}

function SearchPrompt() {
  const list = usePromptList();
  const [isPress, setIsPress] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [, setRenderPromptList] = useAtom(renderPromptListAtom);
  React.useEffect(() => {
    if (inputValue.length > 0) {
      const renderList = list.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setRenderPromptList(renderList);
    } else {
      setRenderPromptList(list);
    }
  }, [list, inputValue, setRenderPromptList]);

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
          {inputValue.length === 0 ? (
            <Icon as={SearchIcon} />
          ) : (
            <Icon as={ScanSearchIcon} />
          )}
        </Pressable>
      )}
    </>
  );
}

function PromptList() {
  const [list] = useAtom(renderPromptListAtom);
  if (list === undefined)
    return (
      <Box className="w-full p-3">
        <Skeleton className="w-full h-14 " />
      </Box>
    );

  if (list.length === 0)
    return (
      <Box className="h-full justify-center items-center">
        <Box className="flex flex-col items-center gap-y-4">
          <Icon size="xl" as={HammerIcon} />
          <Text>未找到相关提示词</Text>
        </Box>
      </Box>
    );
  return (
    <ScrollView>
      <VStack>
        {list.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/prompt/${item.id}`)}
            className="h-20 overflow-hidden"
          >
            <Card>
              <HStack className="justify-between items-center">
                <Text bold>{item.name}</Text>
                <Icon as={ArrowRightIcon} />
              </HStack>
            </Card>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
}

function PromptFab() {
  const [, setImportPromptModal] = useAtom(modalAtom("importPrompt"));
  return (
    <Menu
      placement="top right"
      offset={5}
      disabledKeys={["Settings"]}
      trigger={({ ...triggerProps }) => {
        return (
          <Fab size="md" placement="bottom right" {...triggerProps}>
            <FabIcon as={AddIcon} />
          </Fab>
        );
      }}
    >
      <MenuItem
        onPress={() => setImportPromptModal(true)}
        key="Import prompt"
        textValue="Import prompt"
      >
        <Icon as={ImportIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">导入提示词</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

// 导入提示词模态框 atom:importPrompt
const ImportPromptModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalAtom("importPrompt"));
  const [name, setName] = React.useState<string>();
  const [previewData, setPreviewData] = React.useState<ConverPromptResult>();
  const handleSelectPrompt = async () => {
    const result = await pickPrompt();
    if (!result) {
      toast.error("导入失败或者用户取消选择");
      return;
    }
    setName(result.name.split(".json")[0]);
    setPreviewData(result);
  };
  const handleImportPrompt = async () => {
    if (!previewData || !name) return;
    const result = await createImportPrompt(name, previewData);
    if (!result) {
      toast.error("导入失败");
      return;
    }
    toast.success("导入提示词成功");
    setIsOpen(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>导入提示词</Heading>
          <Button onPress={handleSelectPrompt}>
            <ButtonIcon as={FileUpIcon} />
          </Button>
        </ModalHeader>
        <ModalBody>
          {previewData && (
            <Box className="max-h-60">
              <VStack space="sm">
                <Text>提示词名称</Text>
                <Input>
                  <InputField value={name} onChangeText={setName} />
                </Input>
                <Text>提示词条目</Text>
                <ScrollView>
                  {previewData.content.map((item) => (
                    <Text key={item.id}>{item.name}</Text>
                  ))}
                </ScrollView>
              </VStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={handleImportPrompt}
            isDisabled={!previewData || name?.length === 0}
            className="w-full"
          >
            <ButtonText>确认导入</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
