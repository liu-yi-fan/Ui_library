import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonGroup } from "../button-group"

const meta = {
  title: "Example/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: "Day", primary: true },
      { label: "Week" },
      { label: "Month" },
    ],
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    className: "w-80",
    items: [
      { label: "Overview" },
      { label: "Events", primary: true },
      { label: "Alerts" },
    ],
  },
}

export const WithIcons: Story = {
  args: {
    items: [
      { label: "", icon: "☀️", primary: true },
      { label: "Week", icon: "📅" },
      { label: "Month", icon: "🗓️", iconPosition: "right" },
    ],
  },
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    items: [
      { label: "Edit" },
      { label: "Duplicate" },
      { label: "Archive" },
    ],
    // buttonClassName:"bg-amber-500"
  },
}

export const outline: Story = {
  args: {
    items: [
      { label: "Edit", className: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" },
      { label: "Duplicate", className: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" },
      { label: "Archive", className: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors" },
    ],
  },
}
