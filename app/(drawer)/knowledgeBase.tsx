import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { AddIcon, Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@/components/ui/modal';
import { modalAtom } from '@/store/core';
import { ConvertKnowledgeBaseResult } from '@/types/result';
import { pickKnowledgeBase } from '@/utils/file/picker';
import React from 'react';
import { useAtom } from 'jotai';
import { FileUpIcon, ImportIcon } from 'lucide-react-native';
import { toast } from 'sonner-native';

export default function KnowledgeBaseScreen() {
  return (
    <Box className="h-full">
      <KnowledgeBaseFab />
      <ImportKnowledgeBaseModal />
    </Box>
  );
}

const KnowledgeBaseFab = () => {
  const [, setImportKnowledgeBaseModal] = useAtom(modalAtom('importKnowledgeBase'));
  return (
    <Menu
      placement="top right"
      offset={5}
      trigger={({ ...triggerProps }) => {
        return (
          <Fab size="md" placement="bottom right" {...triggerProps}>
            <FabIcon as={AddIcon} />
          </Fab>
        );
      }}>
      <MenuItem
        onPress={() => setImportKnowledgeBaseModal(true)}
        key="Import knowledgeBase"
        textValue="Import knowledgeBase">
        <Icon as={ImportIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">导入知识库</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

const ImportKnowledgeBaseModal = () => {
  const [isOpen, setIsOpen] = useAtom(modalAtom('importKnowledgeBase'));
  const [previewData, setPreviewData] = React.useState<ConvertKnowledgeBaseResult>();
  const handleImport = async () => {
    try {
      const result = await pickKnowledgeBase();
      if (!result) return;
      setPreviewData(result);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={setIsOpen}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>导入知识库</Heading>
          <Button onPress={handleImport}>
            <ButtonIcon as={FileUpIcon} />
          </Button>
        </ModalHeader>
        <ModalBody>
          {previewData && (
            <Box>
              <Heading>{previewData.name}</Heading>
            </Box>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
