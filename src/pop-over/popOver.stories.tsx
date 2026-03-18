import type { Meta, StoryObj } from "@storybook/react"
import type React from "react"
import { PopOver } from "./PopOver"
import { PopOverContent, PopOverTrigger } from "./components"

const meta = {
  title: "PopOver/PopOver",
  component: PopOver,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: 80 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PopOver>

export default meta

type Story = StoryObj<typeof meta>

const triggerStyle = {
  border: "1px solid #d4d4d8",
  borderRadius: 8,
  padding: "10px 14px",
  backgroundColor: "white",
  cursor: "pointer",
} satisfies React.CSSProperties

const baseArgs = {
  className: "relative inline-flex",
}

export const Default: Story = {
  args: {
    ...baseArgs,
    trigger: <PopOverTrigger style={triggerStyle}>Open details</PopOverTrigger>,
    content: (
      <PopOverContent>
        <div className="space-y-2">
          <p className="font-medium text-zinc-900">Camera status</p>
          <p className="text-zinc-600">Front door camera is online and recording normally.</p>
        </div>
      </PopOverContent>
    ),
  },
}

export const TopAligned: Story = {
  args: {
    ...baseArgs,
    trigger: <PopOverTrigger style={triggerStyle}>Top popover</PopOverTrigger>,
    content: (
      <PopOverContent side="top" align="start">
        <div className="space-y-2">
          <p className="font-medium text-zinc-900">Quick actions</p>
          <p className="text-zinc-600">Review the latest event clip or jump to live view.</p>
        </div>
      </PopOverContent>
    ),
  },
}

export const RightSide: Story = {
  args: {
    ...baseArgs,
    trigger: <PopOverTrigger style={triggerStyle}>Right side</PopOverTrigger>,
    content: (
      <PopOverContent side="right" align="center">
        <div className="space-y-2">
          <p className="font-medium text-zinc-900">Site note</p>
          <p className="text-zinc-600">This popover can be aligned on any side of the trigger.</p>
        </div>
      </PopOverContent>
    ),
  },
}

export const CustomAnchorTrigger: Story = {
  args: {
    ...baseArgs,
    trigger: (
      <PopOverTrigger asChild>
        <a
          href="#popover-details"
          style={{
            color: "#0f766e",
            textDecoration: "underline",
            textUnderlineOffset: 4,
            cursor: "pointer",
          }}
        >
          Open from link
        </a>
      </PopOverTrigger>
    ),
    content: (
      <PopOverContent>
        <div className="space-y-2">
          <p className="font-medium text-zinc-900">Custom trigger</p>
          <p className="text-zinc-600">Any single child element can act as the trigger via the asChild prop.</p>
        </div>
      </PopOverContent>
    ),
  },
}
