import { memo } from 'react';

import Link from 'next/link';

export interface AnchorProps {
  children: React.ReactNode;
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  rel: 'noopener' | 'noreferrer';
  className?: string;
}

const Anchor = memo<AnchorProps>(({ children, href, target, rel, className }) => (
  <Link href={href} target={target} rel={rel} className={className}>
    {children}
  </Link>
));

Anchor.displayName = 'Anchor';

export default Anchor;
