import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as SecureStore from "expo-secure-store";
import { Storage } from "expo-sqlite/kv-store";
import { BoltIcon, KeyIcon, ListRestartIcon, XIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { toast } from "sonner-native";
export default function GeminiScreen() {
  return (
    <Box className="h-ful p-3">
      <VStack space="md">
        <KeyGroup />
        <KeyGroupPolling />
      </VStack>
    </Box>
  );
}

// await SecureStore.setItem("TRANCE_MODEL_GEMINI_KEY", key);

const KeyGroup = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [keyGroup, setKeyGroup] = React.useState<string[]>([]);
  const [key, setKey] = React.useState<string>("");
  const handleAddKey = () => {
    if (key.length === 0) {
      toast.error("密钥不能为空");
      return;
    }
    setKeyGroup([...keyGroup, key]);
    setKey("");
    toast.success("添加成功");
  };

  const handleDeleteKey = (index: number) => {
    setKeyGroup(keyGroup.filter((_, i) => i !== index));
    toast.success("删除成功");
  };

  const handleSaveKeyGroup = async () => {
    try {
      await SecureStore.setItem(
        "TRANCE_MODEL_GEMINI_KEYGROUP",
        JSON.stringify(keyGroup),
      );
      setIsOpen(false);
      toast.success("保存成功");
    } catch (error) {
      console.log(error);
      toast.error("保存失败");
    }
  };

  React.useEffect(() => {
    const fetchKeyGroup = async () => {
      const result = await SecureStore.getItem("TRANCE_MODEL_GEMINI_KEYGROUP");
      if (result) {
        const keyGroup = JSON.parse(result);
        setKeyGroup(keyGroup);
      }
    };
    fetchKeyGroup();
  }, []);
  return (
    <Box>
      {/* 卡片部分 */}
      <Pressable onPress={() => setIsOpen(true)}>
        <Card>
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center">
              <Icon as={KeyIcon} />
              <Heading>密钥组</Heading>
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
            <HStack className="justify-between">
              <Heading size="md" className="text-typography-950">
                Gemini 密钥
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalBody className="max-h-[300px]">
            <VStack space="md">
              <Text>密钥添加后无法查看和修改</Text>
              <Box>
                <HStack className="justify-between items-center" space="md">
                  <Input className="flex-1">
                    <InputField
                      type="password"
                      value={key}
                      onChangeText={setKey}
                    />
                  </Input>
                  <Button onPress={handleAddKey}>
                    <ButtonIcon as={AddIcon} />
                  </Button>
                </HStack>
              </Box>

              <ScrollView>
                {keyGroup.map((item, index) => (
                  <Pressable key={String(index)}>
                    <HStack className="justify-between items-center">
                      <Text>AIzaSyB-XXXX{item.slice(-4)}</Text>
                      <Button
                        onPress={() => handleDeleteKey(index)}
                        variant="link"
                      >
                        <ButtonIcon as={XIcon} />
                      </Button>
                    </HStack>
                  </Pressable>
                ))}
              </ScrollView>
            </VStack>
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
            <Button onPress={handleSaveKeyGroup}>
              <ButtonText>保存</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const KeyGroupPolling = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [counter, setCounter] = React.useState<number>(0);
  const handleSave = async () => {
    try {
      await Storage.setItem("TRANCE_MODEL_GEMINI_POLLING", String(counter));
      setIsOpen(false);
      toast.success("保存成功");
    } catch (error) {
      console.log(error);
      toast.error("保存失败");
    }
  };
  React.useEffect(() => {
    const fetchPolling = async () => {
      const result = await Storage.getItem("TRANCE_MODEL_GEMINI_POLLING");
      if (result) {
        setCounter(Number(result));
      }
      if (typeof result === "undefined" || result === null) {
        setCounter(0);
      }
    };
    fetchPolling();
  }, []);
  return (
    <Box>
      <Pressable onPress={() => setIsOpen(true)}>
        <Card>
          <HStack className="justify-between items-center">
            <HStack space="md" className="items-center">
              <Icon as={ListRestartIcon} />
              <Heading>轮询</Heading>
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
              Gemini 密钥轮询次数
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Box className="p-8">
              <Slider
                onChange={(value) => setCounter(value)}
                minValue={0}
                maxValue={30}
                defaultValue={counter}
                size="md"
                orientation="horizontal"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
            <Text>每{counter}次切换API密钥（0为不切换）</Text>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsOpen(false)} variant="outline">
              <ButtonText>取消</ButtonText>
            </Button>
            <Button>
              <ButtonText onPress={handleSave}>保存</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
