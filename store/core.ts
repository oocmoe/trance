// store/core.ts
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

/**
 * 全局主题状态
 */
export const colorModeAtom = atom<'light' | 'dark'>('light')

/**
 * 模态框状态
 * 使用时须传入唯一ID
 */
export const modalAtom = atomFamily((id: string) => atom(false));


