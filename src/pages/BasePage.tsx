import type React from "react";

type BasePageProps = {
  children: React.ReactNode;
  className?: string;
};

export const BasePage: React.FC<BasePageProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
    </div>
  );
};

export const withBasePage = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const WithBasePage: React.FC<P> = (props) => {
    return (
      <BasePage>
        <WrappedComponent {...(props as P)} />
      </BasePage>
    );
  };

  return WithBasePage;
};
