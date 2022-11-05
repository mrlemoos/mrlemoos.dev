import { createElement, HTMLAttributes, memo, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLElementAttributes = HTMLAttributes<HTMLElement>;
type OmittedHTMLElementAttributes = Omit<HTMLElementAttributes, 'children'>;

export type TextElementType = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface TextProps extends OmittedHTMLElementAttributes {
  children: ReactNode;
  /** @default 'span' */
  as?: TextElementType;
}

// MARK: - Constants
const classes = {
  root: 'mrl-text',
};

// MARK: - JSX
const Text = memo<TextProps>(({ children, as = 'span', className, ...attributes }) =>
  createElement<HTMLElementAttributes>(
    as,
    {
      ...attributes,
      className: concat(classes.root, 'font-sans', className),
    },
    children
  )
);

export default Text;
