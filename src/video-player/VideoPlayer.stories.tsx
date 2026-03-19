import type { Meta, StoryObj } from "@storybook/react"
import { VideoPlayer } from "./VideoPlayer"

const SAMPLE_VIDEO = {
  videoId: "cam01_clip",
  src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  durationMs: 5000,
}

const SAMPLE_STATS = {
  videoId: "cam01_clip",
  src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  durationMs: 600000,
  bucketSizeMs: 5000,
  activity: [0, 2, 5, 3, 8, 1, 0, 0, 4, 6],
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
    showSegmentPopover: {
      control: "boolean",
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

export const SegmentLineOnly: Story = {
  args: {
    ...SAMPLE_VIDEO,
    showSegmentPopover: false,
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

export const WithActivity: Story = {
  args: {
    ...SAMPLE_VIDEO,
    activity: {
      activity: SAMPLE_STATS.activity,
    },
  },
}

export const WithBoth: Story = {
  args: {
    ...SAMPLE_VIDEO,
    segments: [
      { id: "seg1", startMs: 100, endMs: 300, detType: "person", snapdshot: "https://miro.medium.com/v2/resize:fit:1400/1*C5z2ZJ3kGDXn2rA7Yi3Y1A.png" },
      { id: "seg2", startMs: 500, endMs: 900, detType: "vehicle", snapdshot: "https://miro.medium.com/v2/resize:fit:1400/1*C5z2ZJ3kGDXn2rA7Yi3Y1A.png" },
      { id: "seg3", startMs: 1000, endMs: 1300, detType: "person", snapdshot: "https://miro.medium.com/v2/resize:fit:1400/1*C5z2ZJ3kGDXn2rA7Yi3Y1A.png" }
    ],
    activity: {
      activity: SAMPLE_STATS.activity,
    },
  },
}
