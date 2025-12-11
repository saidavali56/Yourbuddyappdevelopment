import { Sparkles } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
  size?: 'small' | 'large';
}

export function Logo({ onClick, size = 'large' }: LogoProps) {
  const isLarge = size === 'large';
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      <div className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12'} bg-gradient-to-br from-primary via-secondary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg`}>
        <Sparkles className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
      </div>
      <div>
        <h1 className={`${isLarge ? '' : 'text-xl'} bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent`}>
          YOUR BUDDY
        </h1>
        {isLarge && (
          <p className="text-sm text-gray-600">Your AI Friend for Life</p>
        )}
      </div>
    </div>
  );
}
