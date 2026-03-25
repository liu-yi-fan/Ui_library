import { ButtonGroup } from "@/button-group";
import { ToolBarMode } from "@/painter/Painter";

interface ToolBarProps {
  onModeChange: (mode: ToolBarMode) => void
}

export const ToolBar = ({ onModeChange }: ToolBarProps) => {
  const ToolBarItems = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21L8 3"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      label: "",
      onClick: () => onModeChange('line')
    },
    {
      icon: (
        <svg
          width="20"
          height="22"
          viewBox="0 0 24 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 22.5V0.5H22.5L18.1 7.23469L22.5 22.5H0.5Z"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      label: "",
      onClick: () => onModeChange('polygon')
    },
    {
      icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="16" height="16" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>),
      label: "",
      onClick: () => onModeChange('square')
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      label: "",
      onClick: () => onModeChange('ellipse')
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#FFFFFF"
            stroke-width="1"
            fill="purple"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      label: "",
      onClick: () => onModeChange('select')
    }
  ];

  return <ButtonGroup orientation="vertical" items={ToolBarItems} />;
};
