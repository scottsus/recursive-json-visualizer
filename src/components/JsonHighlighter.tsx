import React from "react";

interface JsonHighlighterProps {
  json: string;
}

export function JsonHighlighter({ json }: JsonHighlighterProps) {
  if (!json) {
    return (
      <span className="text-gray-500 dark:text-gray-400 italic">
        Processed JSON will appear here...
      </span>
    );
  }

  const highlightJson = (jsonString: string) => {
    const lines = jsonString.split("\n");

    return lines.map((line, lineIndex) => {
      const processedLine = line.replace(
        /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g,
        (match, key, string, boolean, number) => {
          if (key) {
            return `<span class="text-teal-400 font-medium">${key}</span>:`;
          } else if (string) {
            return `<span class="text-pink-400">${string}</span>`;
          } else if (boolean) {
            return `<span class="text-purple-400">${boolean}</span>`;
          } else if (number) {
            return `<span class="text-blue-400">${number}</span>`;
          }
          return match;
        }
      );

      return (
        <div
          key={lineIndex}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });
  };

  return (
    <div className="font-mono text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
      {highlightJson(json)}
    </div>
  );
}
