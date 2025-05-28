import { Heading } from "@/components/ui/heading";
import type { CharacterTable } from "@/db/schema";
import { Image } from "expo-image";
import { Pressable, Animated, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

type CharacterCardProps = {
  character: CharacterTable;
};

export const CharacterCard = ({ props }: { props: CharacterCardProps }) => {
  const [animation] = useState(new Animated.Value(1));

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => router.push(`/character/${props.character.id}`)}
    >
      <Animated.View style={{ transform: [{ scale: animation }] }}>
        <Image
          source={{ uri: props.character.cover }}
          className="w-full h-56 rounded-md"
          contentFit="cover"
        />
      </Animated.View>
      <Heading className="mt-2">{props.character.name}</Heading>
    </Pressable>
  );
};