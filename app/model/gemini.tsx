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
import { Text } from "@/components/ui/text";
import * as SecureStore from "expo-secure-store";
import { BoltIcon, KeyIcon } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { toast } from "sonner-native";
export default function GeminiScreen() {
  return (
    <Box className="h-ful p-3">
      <Key />
    </Box>
  );
}

function Key() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [key, setKey] = React.useState<string>("******************");

  // 保存key
  const handleSave = async () => {
    try {
      await SecureStore.setItem("TRANCE_MODEL_GEMINI_KEY", key);
      setKey("******************");
      setIsOpen(false);
      toast.success("保存成功");
    } catch (error) {
      setKey("******************");
      console.log(error);
      toast.error("保存失败");
    }
  };

  return (
    <>
      {/* 卡片部分 */}
      <Pressable onPress={() => setIsOpen(true)} className="h-24">
        <Card>
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center">
              <Icon as={KeyIcon} />
              <Heading>密钥</Heading>
            </HStack>
            <Icon as={BoltIcon} />
          </HStack>
        </Card>
      </Pressable>

      {/* 模态框部分 */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Gemini 密钥
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Input variant="outline" size="md">
              <InputField value={key} onChangeText={setKey} type="password" />
            </Input>
            <Text className="mt-2">密钥保存后无法查看或重复相同保存</Text>
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
            <Button
              isDisabled={key === "******************"}
              onPress={handleSave}
            >
              <ButtonText>保存</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
