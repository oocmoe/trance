import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useRegexById } from '@/hook/regex';
import { useLocalSearchParams } from 'expo-router';

export default function RegexByIdScreen() {
  return (
    <Box className="h-full p-3">
      <RegexDetails />
    </Box>
  );
}

const RegexDetails = () => {
  const { id } = useLocalSearchParams();
  const regex = useRegexById(Number(id));
  return (
    <Box>
      {regex && (
        <VStack space="md">
          <Heading>{regex.name}</Heading>
          <Card>
            <VStack space="sm">
              <Text>查找</Text>
              <Textarea isDisabled>
                <TextareaInput value={regex.replace} />
              </Textarea>
            </VStack>
          </Card>
          <Card>
            <VStack space="sm">
              <Text>替换</Text>
              <Textarea isDisabled>
                <TextareaInput value={regex.placement} />
              </Textarea>
            </VStack>
          </Card>
        </VStack>
      )}
    </Box>
  );
};
