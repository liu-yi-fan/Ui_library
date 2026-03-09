import type { Meta, StoryObj } from '@storybook/react'
import { VideoPlayer } from './VideoPlayer'

// 範例影片來源 - 使用免費的測試影片
const SAMPLE_VIDEO = {
  mp4: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  webm: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
}

const meta: Meta<typeof VideoPlayer> = {
  title: 'VideoPlayer/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '影片來源網址',
    },
  },
}

export default meta
type Story = StoryObj<typeof VideoPlayer>

// 基本範例 - 使用 MP4 影片
export const Default: Story = {
  args: {
    src: SAMPLE_VIDEO.mp4,
  },
}

// 使用 WebM 格式
export const WebMFormat: Story = {
  args: {
    src: SAMPLE_VIDEO.webm,
  },
  parameters: {
    docs: {
      description: {
        story: '使用 WebM 格式的影片',
      },
    },
  },
}

// 自訂影片來源
export const CustomVideo: Story = {
  args: {
    src: "https://example.com/your-video.mp4", // 替換成你的影片網址
  },
  parameters: {
    docs: {
      description: {
        story: '使用自訂的影片來源',
      },
    },
  },
}

// 如果影片需要特定的尺寸設定，可以在 decorator 中調整
export const WithCustomSize: Story = {
  args: {
    src: SAMPLE_VIDEO.mp4,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
}