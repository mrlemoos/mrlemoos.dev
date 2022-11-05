import { memo } from 'react';

import Image from 'next/image';
import concat from '../util/concat';

// MARK: - Types
export interface AvatarProps {
  src: string;
  alt: string;

  width?: number;
  height?: number;

  className?: string;
}

// MARK: - Constants
const classes = {
  root: 'mrl-avatar',
};

// MARK: - JSX
const Avatar = memo<AvatarProps>(({ src, alt, height, width, className }) => (
  <Image
    src={src}
    alt={alt}
    fill={false}
    className={concat(classes.root, 'rounded-full border-2 dark:border-indigo-100 border-indigo-800', className)}
    width={width}
    height={height}
  />
));

Avatar.displayName = 'Avatar';

export default Avatar;
