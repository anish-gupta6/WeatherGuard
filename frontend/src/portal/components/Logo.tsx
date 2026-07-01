import { Cloud } from 'lucide-react';
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

const Logo: React.FC<Props> = ({ size = 'md', light = false }) => {
  const sizes = {
    sm: { icon: 'text-2xl', title: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 'text-3xl', title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'text-5xl', title: 'text-3xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.icon} flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 ring-1 ring-green-500/30`}>
        <Cloud className='text-green-500'/>
      </div>
      <div>
        <div className={`${s.title} font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
          Weather<span className="text-green-500">Guard</span>
        </div>
        <div className={`${s.sub} font-medium uppercase tracking-widest ${light ? 'text-green-300/70' : 'text-gray-400'}`}>
          Alert Platform
        </div>
      </div>
    </div>
  );
};

export default Logo;
