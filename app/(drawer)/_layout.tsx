// app/(drawer)/_layout.tsx
import { ThemeSwitch } from '@/components/themeSwitch';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon, MessageCircleIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { colorModeAtom } from '@/store/core';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAtom } from 'jotai';
import { BookUserIcon, BotIcon, CogIcon, Info } from 'lucide-react-native';
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

// 自定义Header颜色，限/(drawer)下路由
const CustomDrawerHeaderBackground = () => {
  return <Box className="flex-1 dark:bg-slate-800" />;
};

// 导航列表
const drawerNavList = [
  {
    sortId: 1,
    name: '消息',
    path: '(drawer)/message',
    icon: MessageCircleIcon
  },
  {
    sortId: 2,
    name: '角色卡',
    path: '(drawer)/character',
    icon: BookUserIcon
  },
  {
    sortId: 3,
    name: '模型',
    path: '(drawer)/model',
    icon: BotIcon
  },
  {
    sortId: 4,
    name: '设置',
    path: '(drawer)/setting',
    icon: CogIcon
  },
  {
    sortId: 5,
    name: '关于',
    path: '(drawer)/about',
    icon: Info
  }
];

// 自定义侧边栏
const CustomDrawerContent = () => {
  return (
    <Box className="flex-1 dark:bg-slate-900">
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
          <Box className="p-6">
            <VStack space="4xl">
              {drawerNavList.map((item) => (
                <Pressable onPress={() => router.push(item.path as any)} key={item.sortId}>
                  <HStack space="2xl" className="items-center">
                    <Icon size="xl" as={item.icon} />
                    <Heading>{item.name}</Heading>
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
