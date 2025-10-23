import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

const generateColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 75%, 60%)`;
  return color;
};

export const Avatar: React.FC<AvatarProps> = ({ name, className = 'h-10 w-10' }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');
  
  const bgColor = generateColor(name);

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold text-sm ${className} flex-shrink-0`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {initials.toUpperCase()}
    </div>
  );
};
