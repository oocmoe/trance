import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useMessageById } from '@/hook/message';
import { useRoomById } from '@/hook/room';
import { tranceHi } from '@/utils/message/middleware';
import React from 'react';
import { ScrollView } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';

export default function RoomByIdScreen() {
  return (
    <Box className="h-full">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          }
        }}
      />
      <ScrollView>
        <RenderMessage />
      </ScrollView>

      <ActionBar />
    </Box>
  );
}

function RenderMessage() {
  const { id } = useLocalSearchParams();
  const messages = useMessageById(Number(id));
  return (
    <Box>
      <VStack></VStack>
    </Box>
  );
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
  const { id } = useLocalSearchParams();
  const room = useRoomById(Number(id));
  const [userInput, setUserInput] = React.useState<string>('');

  const handleHi = async () => {
    await tranceHi(userInput, 'text', room);
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
