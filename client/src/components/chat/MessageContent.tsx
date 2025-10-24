import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MessageContentProps {
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const codeId = `code-${Math.random()}`;
            const language = match ? match[1] : "text";

            return !match ? (
              <div className="relative group my-4 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                  <span className="text-xs text-gray-400 font-mono uppercase">
                    {language}
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeString, codeId)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                    title="Copy code"
                  >
                    {copiedCode === codeId ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="mt-0! mb-0! bg-gray-900! p-4!">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <div className="mb-4 last:mb-0 leading-7">{children}</div>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-7">{children}</li>;
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold mb-4 mt-6 pb-2 border-b">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mb-3 mt-6">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>;
          },
          h4({ children }) {
            return (
              <h4 className="text-base font-bold mb-2 mt-3">{children}</h4>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-sm font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="px-4 py-2 text-sm">{children}</td>;
          },
          hr() {
            return <hr className="my-6 border-gray-300 dark:border-gray-700" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
