import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { AddIcon, Icon } from '@/components/ui/icon';
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
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { modalAtom } from '@/store/core';
import { ConverPromptResult } from '@/types/result';
import { createImportPrompt } from '@/utils/db/promot';
import { pickPrompt } from '@/utils/file/picker';
import React from 'react';
import { ScrollView } from 'react-native';
import { useAtom } from 'jotai';
import { FileUpIcon, ImportIcon } from 'lucide-react-native';
import { toast } from 'sonner-native';

export default function PromptScreen() {
  return (
    <>
      <PromptList />
      <PromptFab />
      <ImportPromptModal />
    </>
  );
}

function PromptList() {
  return <ScrollView></ScrollView>;
}

function PromptFab() {
  const [, setImportPromptModal] = useAtom(modalAtom('importPrompt'));
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
        onPress={() => setImportPromptModal(true)}
        key="Import prompt"
        textValue="Import prompt">
        <Icon as={ImportIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">导入提示词</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

// 导入提示词模态框 atom:importPrompt
const ImportPromptModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalAtom('importPrompt'));
  const [name, setName] = React.useState<string>();
  const [previewData, setPreviewData] = React.useState<ConverPromptResult>();
  const handleSelectPrompt = async () => {
    const result = await pickPrompt();
    if (!result) {
      toast.error('导入失败或者用户取消选择');
      return;
    }
    setName(result.name.split('.json')[0]);
    setPreviewData(result);
  };
  const handleImportPrompt = async () => {
    if (!previewData) return;
    const result = await createImportPrompt(previewData);
    if (!result) {
      toast.error('导入失败');
      return;
    }
    toast.success('导入提示词成功');
    setIsOpen(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}>
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
                  <InputField value={name} />
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
            className="w-full">
            <ButtonText>确认导入</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
