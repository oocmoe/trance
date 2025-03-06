import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@/components/ui/modal';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { Regex } from '@/db/schema/regex';
import { useRegexById } from '@/hook/regex';
import { deleteRegexById, updateRegexFieldById } from '@/utils/db/regex';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2Icon } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { toast } from 'sonner-native';

export default function RegexByIdScreen() {
  return (
    <Box className="h-full p-3">
      <Box className="flex-1">
        <ScrollView>
          <RegexDetails />
          <RegexStatus />
        </ScrollView>
      </Box>
      <DeleteRegex />
    </Box>
  );
}

const RegexDetails = () => {
  const { id } = useLocalSearchParams();
  const regex = useRegexById(Number(id));
  return (
    <Box>
      {regex && (
        <VStack space="md">
          <Heading>{regex.name}</Heading>
          <Card>
            <VStack space="sm">
              <Text>查找</Text>
              <Textarea isDisabled>
                <TextareaInput value={regex.replace} />
              </Textarea>
            </VStack>
          </Card>
          <Card>
            <VStack space="sm">
              <Text>替换</Text>
              <Textarea isDisabled>
                <TextareaInput value={regex.placement} />
              </Textarea>
            </VStack>
          </Card>
        </VStack>
      )}
    </Box>
  );
};

const RegexStatus = () => {
  const { id } = useLocalSearchParams();
  const regex = useRegexById(Number(id));
  const handleUpdateStatus = async (value: boolean, field: keyof Regex) => {
    const result = await updateRegexFieldById(Number(id), field, value);
  };
  return (
    <Box>
      {regex && (
        <VStack space="md">
          <Box>
            <HStack space="md" className="justify-between  items-center">
              <Text>正则开关</Text>
              <Switch
                value={regex.is_Enabled}
                onChange={(e) => handleUpdateStatus(e.nativeEvent.value, 'is_Enabled')}
              />
            </HStack>
          </Box>
          <Box>
            <HStack space="md" className="justify-between  items-center">
              <Text>全局正则</Text>
              <Switch
                value={regex.is_Global}
                onChange={(e) => handleUpdateStatus(e.nativeEvent.value, 'is_Global')}
              />
            </HStack>
          </Box>
          <Box>
            <HStack space="md" className="justify-between  items-center">
              <Text>发送时使用</Text>
              <Switch
                value={regex.is_Send}
                onChange={(e) => handleUpdateStatus(e.nativeEvent.value, 'is_Send')}
              />
            </HStack>
          </Box>
          <Box>
            <HStack space="md" className="justify-between  items-center">
              <Text>渲染时使用</Text>
              <Switch
                value={regex.is_Render}
                onChange={(e) => handleUpdateStatus(e.nativeEvent.value, 'is_Render')}
              />
            </HStack>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

const DeleteRegex = () => {
  const { id } = useLocalSearchParams();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const handleDeleteRegex = async () => {
    const result = await deleteRegexById(Number(id));
    if (!result) {
      toast.error('删除失败');
      return;
    }
    setIsOpen(false);
    router.push('/(drawer)/regex');
    toast.success('删除成功');
  };
  return (
    <>
      <Button onPress={() => setIsOpen(true)} action="negative">
        <ButtonText>删除正则</ButtonText>
      </Button>
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
            <Button action="negative" onPress={handleDeleteRegex} size="sm" className="flex-grow">
              <ButtonText>永别了</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
