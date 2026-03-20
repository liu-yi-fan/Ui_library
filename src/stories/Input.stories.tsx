import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "../input"

const meta = {
  title: "Example/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text",
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    className: "w-80",
    placeholder: "Search camera or event",
  },
}

export const Invalid: Story = {
  args: {
    defaultValue: "bad input",
    invalid: true,
  },
}

export const Large: Story = {
  args: {
    inputSize: "large",
    placeholder: "Large input",
  },
}
