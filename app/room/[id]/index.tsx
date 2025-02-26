import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { tranceHiGemini } from '@/utils/message/gemini';
import React from 'react';
import { ScrollView } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';

export default function RoomScreen() {
  return (
    <Box className="h-full">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          }
        }}
      />
      <RenderMessage />
      <ActionBar />
    </Box>
  );
}

function RenderMessage() {
  return <ScrollView></ScrollView>;
}

function HeaderRight() {
  const { id } = useLocalSearchParams();
  return (
    <Button onPress={() => router.push(`/room/${id}/detail`)} variant="link">
      <ButtonIcon as={EllipsisIcon} />
    </Button>
  );
}

function ActionBar() {
  const [userInput, setUserInput] = React.useState<string>('');
  const handleHi = () => {
    const tranceHi = async () => {
      console.log('hhh');
      await tranceHiGemini({ model: 'gemini-2.0-flash-lite' });
    };
    tranceHi();
  };
  return (
    <Box className="m-3">
      <HStack space="sm">
        <Input className="flex-1">
          <InputField />
        </Input>
        <Button onPress={handleHi}>
          <ButtonIcon as={SendIcon} />
        </Button>
      </HStack>
    </Box>
  );
}
