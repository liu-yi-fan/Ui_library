import type { Meta, StoryObj } from "@storybook/react"
import { VideoPlayer } from "./VideoPlayer"

const SAMPLE_VIDEO = {
  videoId: "cam01_clip",
  src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  durationMs: 5000,
  segments: [
    {
      id: "seg1",
      startMs: 200,
      endMs: 700,
      detType: "person",
    },
    {
      id: "seg2",
      startMs: 1200,
      endMs: 1800,
      detType: "vehicle",
    },
    {
      id: "seg3",
      startMs: 3200,
      endMs: 4100,
      detType: "person",
    },
  ],
}

const meta = {
  title: "VideoPlayer/VideoPlayer",
  component: VideoPlayer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    videoId: {
      control: "text",
    },
    src: {
      control: "text",
    },
    durationMs: {
      control: "number",
    },
    segments: {
      control: "object",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 800 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoPlayer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: SAMPLE_VIDEO,
}

export const NoSegments: Story = {
  args: {
    ...SAMPLE_VIDEO,
    segments: [],
  },
}

export const DenseTimeline: Story = {
  args: {
    ...SAMPLE_VIDEO,
    segments: [
      { id: "seg1", startMs: 100, endMs: 300, detType: "person" },
      { id: "seg2", startMs: 500, endMs: 900, detType: "vehicle" },
      { id: "seg3", startMs: 1000, endMs: 1300, detType: "person" },
      { id: "seg4", startMs: 1700, endMs: 2100, detType: "vehicle" },
      { id: "seg5", startMs: 2500, endMs: 2900, detType: "person" },
      { id: "seg6", startMs: 3400, endMs: 3900, detType: "vehicle" },
    ],
  },
}
