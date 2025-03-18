import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { useKnowledgeBaseEntryById } from '@/hook/knowledgeBase';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function KnowledgeBaseEntryScreen() {
  return (
    <Box>
      <KnowledgeBaseEntryName />
    </Box>
  );
}

const KnowledgeBaseEntryName = () => {
  const { id, entryId } = useLocalSearchParams();
  const entry = useKnowledgeBaseEntryById(Number(id), Number(entryId));
  if (entry) return <Heading>{entry.name}</Heading>;
};
