import type React from "react";
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface LinkifiedDescriptionProps {
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LinkifiedDescription: React.FC<LinkifiedDescriptionProps> = ({
  description,
  className = "whitespace-pre-line",
  style,
}: LinkifiedDescriptionProps) => {
  if (!description) return null;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  // Find all URLs in the description
  while (true) {
    match = URL_REGEX.exec(description);
    if (match === null) break;

    const url = match[0];
    const matchStart = match.index;
    const matchEnd = URL_REGEX.lastIndex;

    // Add text before the URL
    if (matchStart > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{description.substring(lastIndex, matchStart)}</span>,
      );
    }

    // Add the URL as a link
    parts.push(
      <a
        key={`link-${matchStart}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline break-all"
      >
        {url}
      </a>,
    );

    lastIndex = matchEnd;
  }

  // Add any remaining text after the last URL
  if (lastIndex < description.length) {
    parts.push(<span key="text-end">{description.substring(lastIndex)}</span>);
  }

  return (
    <p className={className} style={style}>
      {parts}
    </p>
  );
};
