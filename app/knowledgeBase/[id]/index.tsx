import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { useKnowledgeBaseById } from "@/hook/knowledgeBase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function knowledgeBaseByIdScreen() {
  return (
    <Box>
      <KnowledgeBaseEntryList />
    </Box>
  );
}

const KnowledgeBaseEntryList = () => {
  const { id } = useLocalSearchParams();
  const list = useKnowledgeBaseById(Number(id));
  const router = useRouter();
  return (
    <ScrollView className="p-3">
      {list?.entries && (
        <VStack space="sm">
          {list.entries.map((item) => {
            return (
              <Pressable
                onPress={() =>
                  router.push(`/knowledgeBase/${id}/entry/${item.id}`)
                }
                key={item.id}
              >
                <Card>
                  <HStack className="justify-between items-center">
                    <Heading>{item.name}</Heading>
                    <Icon as={ArrowRightIcon} />
                  </HStack>
                </Card>
              </Pressable>
            );
          })}
        </VStack>
      )}
    </ScrollView>
  );
};
