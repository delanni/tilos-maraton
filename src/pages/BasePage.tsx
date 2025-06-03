import type React from 'react';

type BasePageProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const BasePage: React.FC<BasePageProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {children}
      </div>
    </div>
  );
};

export const withBasePage = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultTitle: string
) => {
  const WithBasePage: React.FC<P> = (props) => {
    return (
      <BasePage title={defaultTitle}>
        <WrappedComponent {...props as P} />
      </BasePage>
    );
  };
  
  return WithBasePage;
};
