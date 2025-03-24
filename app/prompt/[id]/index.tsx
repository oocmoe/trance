import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { usePromptById } from "@/hook/prompt";
import { modalAtom } from "@/store/core";
import {
  readPromptContentById,
  updatePromptContentField,
} from "@/utils/db/prompt";
import { useLocalSearchParams } from "expo-router";
import { atom, useAtom } from "jotai";
import { TextIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";

const actionContentIdAtom = atom<number>();
export default function PromptByIdScreen() {
  return (
    <>
      <ScrollView>
        <PromptContentList />
      </ScrollView>
      <PromptContetnModal />
    </>
  );
}

const PromptContentList = () => {
  const { id } = useLocalSearchParams();
  const list = usePromptById(Number(id));
  const [, setActionContentId] = useAtom(actionContentIdAtom);
  const [, setActionPromptContentModal] = useAtom(
    modalAtom("actionPromptContent"),
  );
  const handlePress = (contentId: number) => {
    setActionContentId(contentId);
    setActionPromptContentModal(true);
  };
  if (!list?.content)
    return (
      <Box className="p-3">
        <Skeleton className="w-full h-20 rounded-md " />
      </Box>
    );
  if (list.content.length === 0)
    <Box className="h-full justify-center items-center">
      <Box className="flex flex-col items-center gap-y-4">
        <Icon size="xl" as={TextIcon} />
        <Text>未找到相关条目</Text>
      </Box>
    </Box>;
  return (
    <Box className="p-3">
      <VStack space="sm">
        {list.content?.map((item) => (
          <Card key={item.id}>
            <HStack className="justify-between items-center">
              <Pressable onPress={() => handlePress(item.id)}>
                <Heading>{item.name}</Heading>
              </Pressable>
              <Box>
                <PromptContentSwitch
                  id={Number(id)}
                  contentId={item.id}
                  isEnabled={item.isEnabled}
                />
              </Box>
            </HStack>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

const PromptContentSwitch = ({
  id,
  contentId,
  isEnabled,
}: {
  id: number;
  contentId: number;
  isEnabled: boolean;
}) => {
  const handleUpdate = async () => {
    const result = await updatePromptContentField(
      id,
      contentId,
      "isEnabled",
      !isEnabled,
    );
    if (!result) {
      toast.error("更改失败");
    }
  };
  return <Switch onChange={handleUpdate} value={isEnabled} />;
};

const PromptContetnModal = () => {
  const { id } = useLocalSearchParams();
  const [actionContentId] = useAtom(actionContentIdAtom);
  const [isOpen, setIsOpen] = useAtom(modalAtom("actionPromptContent"));
  const [name, setName] = React.useState<string>();
  const [content, setContent] = React.useState<string>();
  React.useEffect(() => {
    if (!actionContentId || !id) return;
    const fetchPromptContent = async () => {
      const result = await readPromptContentById(Number(id), actionContentId);
      if (!result) return;
      setName(result.name);
      setContent(result.content);
    };
    fetchPromptContent();
  }, [actionContentId, id]);

  const handleSave = async () => {
    if (!actionContentId || !name || !content) {
      toast.error("内容不得为空");
      return;
    }
    try {
      await updatePromptContentField(Number(id), actionContentId, "name", name);
      await updatePromptContentField(
        Number(id),
        actionContentId,
        "content",
        content,
      );
      setIsOpen(false);
      toast.success("修改成功");
    } catch (error) {
      console.log(error);
      toast.error("更改失败");
    }
  };
  return (
    <>
      {actionContentId && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <VStack className="flex-1">
                <Text>标题</Text>
                <Input variant="outline">
                  <InputField value={name} onChangeText={setName} />
                </Input>
              </VStack>
            </ModalHeader>
            <ModalBody>
              <Text>内容</Text>
              <Textarea>
                <TextareaInput value={content} onChangeText={setContent} />
              </Textarea>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <ButtonText>取消</ButtonText>
              </Button>
              <Button onPress={handleSave}>
                <ButtonText>保存</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
