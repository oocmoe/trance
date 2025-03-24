import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { colorModeAtom } from "@/store/theme";
import { type Href, router } from "expo-router";
import { useAtom } from "jotai";
import { Pressable, ScrollView } from "react-native";
import { SvgUri } from "react-native-svg";

export default function ModelScreen() {
  return (
    <Box className="h-full p-3">
      <ModelList />
    </Box>
  );
}

// 模型列表
const modelLists = [
  {
    id: 1,
    name: "Gemini",
    path: "/model/gemini",
    icon: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg",
  },
  {
    id: 2,
    name: "自定义接口[OpenAI格式]",
    path: "/model/customOpenAI",
    icon: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg",
  },
];
function ModelList() {
  const [corlorMode] = useAtom(colorModeAtom);
  return (
    <ScrollView>
      <VStack space="md">
        {modelLists.map((item) => (
          <Pressable
            onPress={() => router.push(item.path as Href)}
            key={item.id}
          >
            <Card>
              <HStack className="justify-between items-center">
                <HStack space="md" className="items-center">
                  <SvgUri
                    uri={item.icon}
                    height={24}
                    width={24}
                    color={corlorMode === "light" ? "black" : "white"}
                  />
                  <Heading>{item.name}</Heading>
                </HStack>
                <Icon as={ArrowRightIcon} />
              </HStack>
            </Card>
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
}
