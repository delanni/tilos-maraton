import type React from "react";

type ButtonGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-row gap-2 ${className} overflow-x-auto`.trim()}>
      {children}
    </div>
  );
};
