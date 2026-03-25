import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 一個常用的輔助函數，解決 Tailwind 類名衝突
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  label: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  primary = false,
  size = 'medium',
  label,
  icon,
  iconPosition = 'left',
  className, // 接收外部傳入的 className
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        // 基礎樣式 (如果你已經把 storybook-button 換成 Tailwind 的話)
        'px-4 py-2 rounded font-semibold transition-colors cursor-pointer' ,
        // 根據 Props 變換的樣式
        primary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800',
        size === 'small' && 'text-sm px-2 py-1',
        size === 'large' && 'text-lg px-6 py-3',
        // 外部傳入的樣式 (放在最後面，確保能覆蓋前面的)
        className 
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center">{icon}</span>
      )}
      {label}
      {icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center">{icon}</span>
      )}
    </button>
  );
};