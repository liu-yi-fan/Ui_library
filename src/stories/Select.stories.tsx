import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select } from "../select"

const meta = {
  title: "Example/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: "Taipei", value: "taipei" },
  { label: "Taichung", value: "taichung" },
  { label: "Kaohsiung", value: "kaohsiung" },
]

export const Default: Story = {
  args: {
    defaultValue: "",
    placeholder: "Select a city",
    options,
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    className: "w-80",
    defaultValue: "taichung",
    options,
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "",
    placeholder: "Choose an option",
    options,
  },
}

export const Large: Story = {
  args: {
    selectSize: "large",
    defaultValue: "kaohsiung",
    options,
  },
}
