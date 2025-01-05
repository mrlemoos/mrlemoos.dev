'use client';

import type { JSX } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import merge from '~/styles/merge';

export interface MarkdownProps {
	children: string;
}

const components: Components = {
	h1: ({ className, ...props }) => (
		<h1
			className={merge('text-2xl font-semibold mt-4', className)}
			{...props}
		/>
	),
	h2: ({ className, ...props }) => (
		<h2 className={merge('text-xl font-semibold mt-3', className)} {...props} />
	),
	h3: ({ className, ...props }) => (
		<h3 className={merge('text-lg font-medium mt-2', className)} {...props} />
	),
	h4: ({ className, ...props }) => (
		<h4
			className={merge('text-base font-medium mt-1.5', className)}
			{...props}
		/>
	),
	p: ({ className, ...props }) => (
		<p className={merge('text-inherit mt-2', className)} {...props} />
	),
	code: ({ className, ...props }) => (
		<code className={merge('text-sm', className)} {...props} />
	),
	blockquote: ({ className, ...props }) => (
		<blockquote
			className={merge(
				'text-base italic border-l-2 border-l-zinc-900 dark:border-l-zinc-50',
				className,
			)}
			{...props}
		/>
	),
	ul: ({ className, ...props }) => (
		<ul
			className={merge('list-disc list-inside mt-0.5', className)}
			{...props}
		/>
	),
	ol: ({ className, ...props }) => (
		<ol
			className={merge('list-decimal list-inside mt-0.5', className)}
			{...props}
		/>
	),
	li: ({ className, ...props }) => (
		<li
			className={merge(
				'mt-1 marker:block marker:text-zinc-600 dark:marker:text-zinc-400 font-normal marker:content-[counter(list-item)_"_»_"] mx-3',
				className,
			)}
			{...props}
		/>
	),
	table: ({ className, ...props }) => (
		<table className={merge('mt-2', className)} {...props} />
	),
	tr: ({ className, ...props }) => (
		<tr className={merge('mt-1', className)} {...props} />
	),
	th: ({ className, ...props }) => (
		<th className={merge('mt-1', className)} {...props} />
	),
	td: ({ className, ...props }) => (
		<td className={merge('mt-1', className)} {...props} />
	),
	img: ({ className, ...props }) => (
		<img
			className={merge(
				'w-full border border-zinc-300/30 dark:border-zinc-700/20 rounded-md my-2',
				className,
			)}
			alt={props.alt}
			src={props.src}
		/>
	),
	strong: ({ className, ...props }) => (
		<strong className={merge('font-medium', className)} {...props} />
	),
	em: ({ className, ...props }) => (
		<em className={merge('italic', className)} {...props} />
	),
	hr: ({ className, ...props }) => (
		<hr
			className={merge(
				'my-4 border-zinc-300/30 dark:border-zinc-700/20',
				className,
			)}
			{...props}
		/>
	),
};

export function Markdown({ children }: MarkdownProps): JSX.Element {
	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
			{children}
		</ReactMarkdown>
	);
}
