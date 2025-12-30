import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <div className={`
      bg-surface border border-white/10 rounded-xl p-8 transition-all duration-250
      ${hover ? 'hover:border-white/20 hover:-translate-y-1' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
