import type { Meta, StoryObj } from "@storybook/react-vite"
import { Painter } from "./Painter"

const meta = {
  title: "Painter/Painter",
  component: Painter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Painter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}