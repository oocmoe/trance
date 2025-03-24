import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { AddIcon, Icon, SearchIcon } from "@/components/ui/icon";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useRegexList } from "@/hook/regex";
import { modalAtom } from "@/store/core";
import type { RenderRegexList } from "@/types/render";
import type { ConvertRgexResult } from "@/types/result";
import { createImportRegex } from "@/utils/db/regex";
import { pickRegex } from "@/utils/file/picker";
import { Stack, router } from "expo-router";
import { atom, useAtom } from "jotai";
import {
  FileUpIcon,
  ImportIcon,
  RegexIcon,
  ScanSearchIcon,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";

const renderRegexListAtom = atom<RenderRegexList>();

export default function RegexScreen() {
  return (
    <Box className="h-full">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          },
        }}
      />
      <RgexList />
      <RegexFab />
      <ImportRegexModal />
    </Box>
  );
}

function HeaderRight() {
  return <SearchRegex />;
}

function SearchRegex() {
  const list = useRegexList();
  const [isPress, setIsPress] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [, setRenderRegexList] = useAtom(renderRegexListAtom);
  React.useEffect(() => {
    if (inputValue.length > 0) {
      const renderList = list.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setRenderRegexList(renderList);
    } else {
      setRenderRegexList(list);
    }
  }, [list, inputValue, setRenderRegexList]);

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

function RgexList() {
  const [list] = useAtom(renderRegexListAtom);
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
          <Icon size="xl" as={RegexIcon} />
          <Text>未找到相关正则脚本</Text>
        </Box>
      </Box>
    );
  return (
    <ScrollView>
      <VStack className="m-3">
        {list.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/regex/${item.id}`)}
            className="h-20 overflow-hidden"
          >
            <Card variant="filled">
              <Text bold>{item.name}</Text>
            </Card>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
}

function RegexFab() {
  const [, setImportRegexModal] = useAtom(modalAtom("importRegex"));
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
        onPress={() => setImportRegexModal(true)}
        key="Import Regex"
        textValue="Import Regex"
      >
        <Icon as={ImportIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">导入正则脚本</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

// 导入正则脚本模态框 atom:importRegex
const ImportRegexModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalAtom("importRegex"));
  const [name, setName] = React.useState<string>();
  const [previewData, setPreviewData] = React.useState<ConvertRgexResult>();
  const handleSelectRegex = async () => {
    const result = await pickRegex();
    if (!result) {
      toast.error("导入失败");
      return;
    }
    setPreviewData(result);
    setName(result.name);
  };
  const handleImportRegex = async () => {
    if (!previewData || !name) return;
    const result = await createImportRegex(name, previewData);
    if (!result) {
      toast.error("导入失败");
      return;
    }
    toast.success("导入正则脚本成功");
    setPreviewData(undefined);
    setName(undefined);
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
          <Heading>导入正则脚本</Heading>
          <Button onPress={handleSelectRegex}>
            <ButtonIcon as={FileUpIcon} />
          </Button>
        </ModalHeader>
        <ModalBody>
          {previewData && (
            <Box className="max-h-120">
              <VStack space="sm">
                <Text>正则脚本名称</Text>
                <Input>
                  <InputField value={name} onChangeText={setName} />
                </Input>
                <Text>查找</Text>
                <Textarea isDisabled>
                  <TextareaInput value={previewData.replace} />
                </Textarea>
                <Text>替换</Text>
                <Textarea isDisabled>
                  <TextareaInput value={previewData.placement} />
                </Textarea>
              </VStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={handleImportRegex}
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
