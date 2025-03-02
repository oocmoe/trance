import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Icon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRegexList } from '@/hook/regex';
import { RenderRegexList } from '@/types/regex/lists';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { ScanSearchIcon } from 'lucide-react-native';

const renderRegexListAtom = atom<RenderRegexList>();

export default function RegexScreen() {
  return (
    <Box className="h-full bg-white dark:bg-slate-950">
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderRight />;
          }
        }}
      />
      <RgexList />
    </Box>
  );
}

function HeaderRight() {
  return <SearchRegex />;
}

function SearchRegex() {
  const list = useRegexList();
  const [isPress, setIsPress] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [, setRenderRegexList] = useAtom(renderRegexListAtom);
  React.useEffect(() => {
    if (inputValue.length > 0) {
      const renderList = list.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setRenderRegexList(renderList);
    } else {
      setRenderRegexList(list);
    }
  }, [list, inputValue]);

  return (
    <>
      {isPress ? (
        <Input variant="underlined" className="w-[90%] mx-2">
          <InputField
            value={inputValue}
            onBlur={() => setIsPress(false)}
            onChangeText={setInputValue}
            placeholder="搜索"
          />
        </Input>
      ) : (
        <Pressable className="mx-4" onPress={() => setIsPress(true)}>
          {inputValue.length === 0 ? <Icon as={SearchIcon} /> : <Icon as={ScanSearchIcon} />}
        </Pressable>
      )}
    </>
  );
}

function RgexList() {
  const [list] = useAtom(renderRegexListAtom);
  return (
    <ScrollView>
      {list && typeof list != undefined ? (
        <VStack className="m-3">
          {list.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/regex/${item.id}`)}
              className="h-20 overflow-hidden">
              <Card>
                <Text bold>{item.name}</Text>
              </Card>
            </Pressable>
          ))}
        </VStack>
      ) : (
        <Box className="w-full p-3">
          <Skeleton className="w-full h-14 " />
        </Box>
      )}
    </ScrollView>
  );
}
