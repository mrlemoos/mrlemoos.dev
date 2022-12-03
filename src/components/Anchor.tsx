import { memo } from 'react';

import Link from 'next/link';

import concat from '../util/concat';

// MARK: - Types
type HTMLAnchorElementAttributes = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type OmittedHTMLAnchorElementAttributes = Omit<
  HTMLAnchorElementAttributes,
  'children' | 'target' | 'href' | 'rel' | 'stylesheet' | 'className' | 'translate' | 'prefix'
>;
export interface AnchorProps extends OmittedHTMLAnchorElementAttributes {
  children: React.ReactNode;
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  rel: 'noreferrer' | 'noopener' | 'noreferrer noopener';
  className?: string;
}

// MARK: - Constants
const classes = {
  root: 'mrl-anchor',
};

// MARK: - JSX
const Anchor = memo<AnchorProps>(({ children, href, target, rel, className, referrerPolicy, role, ...attributes }) => (
  <Link
    href={href}
    target={target}
    rel={rel}
    className={concat(classes.root, className)}
    role={role}
    referrerPolicy={referrerPolicy}
    {...attributes}
  >
    {children}
  </Link>
));

Anchor.displayName = 'Anchor';

export default Anchor;
