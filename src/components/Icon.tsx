import { memo, useMemo } from 'react';
import * as icons from '@heroicons/react/24/outline';

export type IconPathSourceProps = keyof typeof icons;

export interface IconProps {
  path: IconPathSourceProps;

  color?: string;

  width?: number | string;
  height?: number | string;

  className?: string;
}

const Icon = memo<IconProps>(({ path, color, width, height, className }) => {
  const Component = icons[path];

  useMemo<void>(() => {
    if (Component === undefined) {
      throw new Error(
        `Icon: path '${path}' is not a valid path source prop name. Our TypeScript should have caught this, are you using it?`
      );
    }
  }, [path]);

  if (!Component) {
    return null;
  }

  return <Component color={color} width={width} height={height} className={className} />;
});

export default Icon;
