import { ReactNode } from 'react';

export const themeColors = [
  '--primary-bg-color',
  '--primary-accent-color',
  '--secondary-accent-color',
  '--primary-gradient-color',
] as const;

type RemovePrefix<S> = S extends `--${infer T}` ? T : never;

export type ThemeColor = RemovePrefix<(typeof themeColors)[number]>;

export type Question = {
  type: 'mcq' | 'input';
  options?: string[];
  question: string;
}