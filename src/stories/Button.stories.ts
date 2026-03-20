import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
  },
};

// 你最引以為傲的漸層按鈕！
export const ClickMe: Story = {
  args: {
    primary: true,
    label: "Click me",
    // 直接傳入普通函數，如果 TypeScript 報錯，可以在下方加一個 // @ts-ignore
    onClick: () => {
      alert("Button clicked!");
    },
    className: "font-bold w-60 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg shadow-md hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 transition-all duration-300"
  }
};

// 示範：如何透過 className 做出你圖中那種「左側帶顏色」的按鈕
export const TaskMode: Story = {
  args: {
    label: "Draw the Line",
    // 透過 border-l-4 加上左側色塊，這就是你 VMS 介面的精髓
    className: " bg-[#1a1a1a] text-white border-l-4 border-green-500 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
  }
};

export const outline: Story = {
  args: {
    label: "Outline Button",
    className: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
  }
};