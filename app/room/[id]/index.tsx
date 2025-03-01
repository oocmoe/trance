import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useMessageById } from '@/hook/message';
import { useRoomById } from '@/hook/room';
import { tranceHi } from '@/utils/message/middleware';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { toast } from 'sonner-native';

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const room = useRoomById(Number(id));
  const [userInput, setUserInput] = React.useState<string>('');

  const handleHi = async () => {
    setIsLoading(true);
    const result = await tranceHi(userInput, 'text', room);
    if (!result) {
      toast.error('发送失败');
    }
    setIsLoading(false);
  };
  return (
    <Box className="m-3">
      <HStack space="sm">
        <Input className="flex-1">
          <InputField onChangeText={setUserInput} />
        </Input>
        {isLoading ? (
          <Button onPress={handleHi}>
            <ButtonSpinner className="text-white" />
          </Button>
        ) : (
          <Button onPress={handleHi}>
            <ButtonIcon as={SendIcon} />
          </Button>
        )}
      </HStack>
    </Box>
  );
}
