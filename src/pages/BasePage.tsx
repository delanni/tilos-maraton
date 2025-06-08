import type React from "react";

type BasePageProps = {
  children: React.ReactNode;
  showContainers?: boolean;
};

type WithChildren = {
  children: React.ReactNode;
  className?: string;
};

export const PageContainer: React.FC<WithChildren> = ({ children, className = "" }) => (
  <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>{children}</div>
);

export const PageContent: React.FC<WithChildren> = ({ children, className = "" }) => (
  <main className={`flex-1 container mx-auto ${className}`}>{children}</main>
);

export const Card: React.FC<WithChildren> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm p-4 mb-4 ${className}`}>{children}</div>
);

export const BasePage: React.FC<BasePageProps> = ({ children, showContainers = false }) => {
  if (showContainers) {
    return (
      <PageContainer>
        <PageContent>{children}</PageContent>
      </PageContainer>
    );
  }
  return <Card>{children}</Card>;
};
