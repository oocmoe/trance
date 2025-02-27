// components/themeSwitch.tsx
import { colorModeAtom } from '@/store/core';
import React from 'react';
import { Storage } from 'expo-sqlite/kv-store';
import { useAtom } from 'jotai';
import { Button, ButtonIcon } from './ui/button';
import { MoonIcon, SunIcon } from './ui/icon';

const ThemeSwitch = () => {
  const [colorMode, setColorMode] = useAtom(colorModeAtom);
  const handleChangeColorMode = async () => {
    const result = await Storage.getItem('colorMode');
    if (result === 'light') {
      await Storage.setItem('colorMode', 'dark');
      setColorMode('dark');
    } else {
      await Storage.setItem('colorMode', 'light');
      setColorMode('light');
    }
  };
  React.useEffect(() => {
    const fetchColorMode = async () => {
      const result = await Storage.getItem('colorMode');
      setColorMode(result as 'light' | 'dark');
    };
    fetchColorMode();
  }, []);

  return (
    <Button onPress={handleChangeColorMode} size="lg" variant="link" className="rounded-full p-3.5">
      {colorMode === 'dark' ? <ButtonIcon as={SunIcon} /> : <ButtonIcon as={MoonIcon} />}
    </Button>
  );
};

export { ThemeSwitch };
