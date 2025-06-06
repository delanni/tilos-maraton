import * as React from "react";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';

type ButtonProps = {
  id?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-main text-white hover:bg-main/90',
  secondary: 'bg-secondary text-white hover:bg-secondary/90',
  accent: 'bg-accent text-white hover:bg-accent/90',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'bg-transparent border border-border text-text hover:bg-gray-50',
  ghost: 'bg-transparent hover:bg-gray-100 text-text',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    icon,
    className = '',
    active = false,
    type = 'button',
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main';
    const activeClass = active ? 'ring-2 ring-offset-2 ring-main' : '';
    
    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${activeClass} ${className}`}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
