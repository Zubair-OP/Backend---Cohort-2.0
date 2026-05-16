import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';

function getPlainText(nodes = []) {
  return nodes
    .map(n => (n.type === 'text' ? n.value : getPlainText(n.children)))
    .join('');
}

function CodeBlock({ node, children, ...props }) {
  const [copied, setCopied] = useState(false);

  const codeEl = node?.children?.find(c => c.tagName === 'code');
  const classes = codeEl?.properties?.className ?? [];
  const lang =
    classes.find(c => c.startsWith('language-'))?.replace('language-', '') ??
    'text';
  const plainText = getPlainText(codeEl?.children ?? []).trimEnd();

  const copy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-zinc-700/50 overflow-hidden">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-zinc-700/40">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre
        {...props}
        className="overflow-x-auto bg-[#0d1117] p-4 text-[12.5px] leading-[1.7] m-0"
      >
        {children}
      </pre>
    </div>
  );
}

const md = {
  pre: CodeBlock,

  code({ node, className, children }) {
    // Block code has language-xxx class; inline does not
    if (className?.startsWith('language-')) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/60 text-[12px] font-mono text-rose-300">
        {children}
      </code>
    );
  },

  h1: ({ node, children }) => (
    <h1 className="text-xl font-bold text-zinc-100 mt-5 mb-3 border-b border-zinc-800 pb-2">
      {children}
    </h1>
  ),
  h2: ({ node, children }) => (
    <h2 className="text-[17px] font-semibold text-zinc-100 mt-4 mb-2">{children}</h2>
  ),
  h3: ({ node, children }) => (
    <h3 className="text-[15px] font-semibold text-zinc-200 mt-3 mb-1.5">{children}</h3>
  ),

  p: ({ node, children }) => <p className="mb-3 last:mb-0">{children}</p>,

  ul: ({ node, children }) => (
    <ul className="mb-3 space-y-1 list-disc pl-5 marker:text-zinc-600">{children}</ul>
  ),
  ol: ({ node, children }) => (
    <ol className="mb-3 space-y-1 list-decimal pl-5 marker:text-zinc-600">{children}</ol>
  ),
  li: ({ node, children }) => (
    <li className="text-zinc-300 leading-relaxed">{children}</li>
  ),

  blockquote: ({ node, children }) => (
    <blockquote className="my-3 pl-4 border-l-2 border-zinc-600 text-zinc-400 italic">
      {children}
    </blockquote>
  ),

  a: ({ node, href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  hr: ({ node }) => <hr className="my-4 border-zinc-800" />,

  strong: ({ node, children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ node, children }) => (
    <em className="italic text-zinc-400">{children}</em>
  ),

  table: ({ node, children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-zinc-700/60">
      <table className="w-full text-[12.5px]">{children}</table>
    </div>
  ),
  thead: ({ node, children }) => (
    <thead className="bg-zinc-800/70">{children}</thead>
  ),
  tbody: ({ node, children }) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
  tr: ({ node, children }) => (
    <tr className="hover:bg-zinc-800/30 transition-colors">{children}</tr>
  ),
  th: ({ node, children }) => (
    <th className="px-4 py-2.5 text-left font-semibold text-zinc-300">{children}</th>
  ),
  td: ({ node, children }) => (
    <td className="px-4 py-2.5 text-zinc-400">{children}</td>
  ),
};

export function MarkdownRenderer({ text, isTyping }) {
  return (
    <div className="p-5 text-[13.5px] text-zinc-300 leading-[1.75]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
        components={md}
      >
        {text}
      </ReactMarkdown>
      {isTyping && (
        <span className="inline-block w-[2px] h-[14px] bg-zinc-400 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}
