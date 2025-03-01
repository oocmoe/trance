import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMessageByRoomId } from '@/hook/message';
import { useRoomById } from '@/hook/room';
import { tranceHi } from '@/utils/message/middleware';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { EllipsisIcon, SendIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
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
  const messages = useMessageByRoomId(Number(id));
  const [characterCover ,setCharacterCover] = React.useState<string>()

  return (
    <VStack>
      {messages &&
        messages.map((item) => {
          if (item.is_Sender === 0) {
            return (
              <Pressable key={item.id} className='m-3'>
                <HStack space="md">
                  {characterCover ? (
                  <Image  />
                  ):(
                    <Skeleton className='w-12 h-12 rounded-full' />
                  )}

                  <Box className="flex-1 bg-amber-50 p-4 rounded-xl rounded-tl-none border border-amber-200  mr-12">
                    <Text>{item.content}</Text>
                  </Box>
                </HStack>
              </Pressable>
            );
          }
          if (item.is_Sender === 1) {
            return (
              <Pressable key={item.id} className='m-3'>
                <HStack className='justify-end'>
                  <Box className='flex-1 bg-white p-4 rounded-xl rounded-br-none border border-slate-50 ml-14'>
                    <Text>
                      {item.content}
                    </Text>
                  </Box>
                </HStack>
              </Pressable>
            )
          }
          return null;
        })}
    </VStack>
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
