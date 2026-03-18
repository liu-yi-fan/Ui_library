import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const srcPath = new URL('../src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': srcPath,
        },
      },
    });
  },
};
export default config;
