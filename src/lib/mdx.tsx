import { CodeBlock } from "@/components/code-block";
import type { MDXRemoteProps } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";

export const mdxComponents: MDXRemoteProps["components"] = {
  h1: ({ children }) => <h1 className="text-2xl font-bold mt-5">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold mt-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold mt-2">{children}</h3>,
  h4: ({ children }) => (
    <h4 className="text-base font-bold mt-1">{children}</h4>
  ),
  h5: ({ children }) => <h5 className="text-sm font-bold">{children}</h5>,
  h6: ({ children }) => <h6 className="text-xs font-bold">{children}</h6>,
  p: ({ children }) => <p className="text-base mb-4">{children}</p>,
  span: ({ children }) => <span className="text-base mb-4">{children}</span>,
  a: ({ children, ...props }) => (
    <Link className="hover:underline" {...props}>
      {children}
    </Link>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="text-base">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-gray-500 pl-4 py-2 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    if (className) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <code className="text-sm bg-gray-100 px-1 rounded">{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt, ...props }) => (
    <Image {...props} src={src} alt={alt} className="w-full h-auto" />
  ),
  table: ({ children }) => (
    <table className="w-full border-collapse border border-gray-300">
      {children}
    </table>
  ),
  th: ({ children }) => <th className="p-2 bg-gray-100">{children}</th>,
  td: ({ children }) => <td className="p-2">{children}</td>,
  hr: () => <hr className="my-4 border-t border-gray-300" />,
  em: ({ children }) => <em className="italic">{children}</em>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  del: ({ children }) => <del className="line-through">{children}</del>,
  sup: ({ children }) => <sup className="">{children}</sup>,
  sub: ({ children }) => <sub className="">{children}</sub>,
};
