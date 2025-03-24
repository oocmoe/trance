// app/(drawer)/setting.tsx

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { type Href, Stack, router } from "expo-router";
import { InfoIcon, PaintRollerIcon } from "lucide-react-native";
import { Pressable } from "react-native";

const lists = [
  {
    id: 1,
    title: "主题",
    path: "/setting/theme",
    icon: PaintRollerIcon,
  },
  {
    id: 2,
    title: "关于 trance",
    path: "/setting/about",
    icon: InfoIcon,
  },
];

export default function SettingScreen() {
  return (
    <Box>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "搜索",
          },
        }}
      />

      <SettingList />
    </Box>
  );
}

const SettingList = () => {
  return (
    <VStack space="sm" className="p-3">
      {lists.map((item) => (
        <Pressable onPress={() => router.push(item.path as Href)} key={item.id}>
          <Card key={item.id}>
            <HStack className="justify-between items-center">
              <Box>
                <HStack className="justify-between items-center" space="sm">
                  <Icon as={item.icon} />
                  <Heading>{item.title}</Heading>
                </HStack>
              </Box>
              <Icon as={ArrowRightIcon} />
            </HStack>
          </Card>
        </Pressable>
      ))}
    </VStack>
  );
};
