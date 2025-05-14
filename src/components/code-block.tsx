import { Highlight, themes } from "prism-react-renderer";
import type { JSX } from "react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({
  children,
  className,
}: CodeBlockProps): JSX.Element {
  const language = className ? className.replace(/language-/, "") : "";

  return (
    <Highlight theme={themes.vsDark} code={children.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} font-code p-4 rounded-md mb-3 overflow-x-auto`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div
              key={`${line
                .map((token) => token.types.join("+"))
                .join(" ")}${i}`}
              {...getLineProps({ line })}
            >
              {line.map((token, j) => (
                <span
                  key={`${token.types.join("+")}${token.content}${j}`}
                  {...getTokenProps({ token })}
                />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
