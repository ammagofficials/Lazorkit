import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  disabled?: boolean;
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-all duration-250 whitespace-nowrap";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50",
    secondary: "bg-surface-elevated text-gray-100 border border-white/10 hover:bg-surface-hover hover:border-white/20",
    accent: "bg-gradient-to-br from-accent to-accent-hover text-white shadow-lg shadow-accent/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40"
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
