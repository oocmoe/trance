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
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Pressable } from 'react-native';
import { BotIcon } from 'lucide-react-native';

export default function RoomDetailScreen() {
  return <Options />;
}

function Options() {
  return (
    <Card className="m-4">
      <OptionsModel />
    </Card>
  );
}

function OptionsModel() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [model, setModel] = React.useState<ModelList[]>();
  return (
    <>
      <Box>
        <Pressable onPress={() => setIsOpen(true)}>
          <HStack className="items-center" space="sm">
            <Icon as={BotIcon} />
            <Text>选择模型</Text>
          </HStack>
        </Pressable>
      </Box>
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
              选择模型
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Select>
              <SelectTrigger>
                <SelectInput />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Gemini" value="Gemini" />
                </SelectContent>
              </SelectPortal>
            </Select>
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
            <Button
              onPress={() => {
                setIsOpen(false);
              }}>
              <ButtonText>保存</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
