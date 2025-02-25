// app/(drawer)/_layout.tsx
import { ThemeSwitch } from '@/components/themeSwitch';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon, MessageCircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { colorModeAtom } from '@/store/core';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAtom } from 'jotai';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrawerLayout() {
  const [colorMode] = useAtom(colorModeAtom);
  return (
    <Drawer
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        swipeEdgeWidth: 768,
        drawerStyle: {
          width: 300,
          borderTopEndRadius: 0,
          borderBottomEndRadius: 0
        },
        headerTintColor: colorMode === 'light' ? '#000' : '#fff',
        headerBackground: () => <CustomDrawerHeaderBackground />
      }}>
      <Drawer.Screen
        name="my"
        options={{
          title: '我的'
        }}
      />
      <Drawer.Screen
        name="message"
        options={{
          title: '消息'
        }}
      />
      <Drawer.Screen
        name="character"
        options={{
          title: '角色卡'
        }}
      />
      <Drawer.Screen
        name="model"
        options={{
          title: '模型'
        }}
      />
      <Drawer.Screen
        name="setting"
        options={{
          title: '设置'
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: '关于 trance'
        }}
      />
    </Drawer>
  );
}

const CustomDrawerHeaderBackground = () => {
  return <Box className="flex-1 dark:bg-slate-800" />;
};

const drawerNavList = [
  {
    name: '消息',
    path: '(drawer)/message',
    icon: MessageCircleIcon
  }
];

const CustomDrawerContent = () => {
  return (
    <Box className="flex-1 dark:bg-slate-800">
      <SafeAreaView>
        <VStack>
          <Box className="h-32 p-3">
            <HStack className="justify-between">
              <VStack space="sm">
                <Box className="w-16 h-16 rounded-full bg-gray-600" />
                <Text>User Name</Text>
              </VStack>
              <ThemeSwitch />
            </HStack>
          </Box>
          <Box className='p-6'>
            <VStack>
              {drawerNavList.map((item) => (
                <Pressable onPress={()=>router.push(item.path as any)} key={item.path}>
                  <HStack>
                    <Icon size='xl' as={item.icon} />
                    <Text>{item.name}</Text>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Box>
        </VStack>
      </SafeAreaView>
    </Box>
  );
};
