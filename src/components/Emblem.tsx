import { memo, HTMLAttributes } from 'react';
import concat from '../util/concat';

// MARK: - Types
type HTMLDivElementAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children' | 'height' | 'width'>;

export interface EmblemProps extends OmittedHTMLDivElementAttributes {
  width: number;
  height: number;
}

// MARK: - Constants
const classes = {
  root: 'mrl-emblem',
};

const Emblem = memo<EmblemProps>(({ width, height, className, ...attributes }) => (
  <div className={concat(classes.root, className)} {...attributes}>
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width={width} height={height}>
      <path d='M 50 0 L 100 100 L 0 100 Z' fill='#000' />

      <path d='M 50 0 L 100 100 L 0 100 Z' fill='#fff' />

      <path d='M 50 0 L 100 100 L 0 100 Z' fill='#000' />

      <path d='M 50 0 L 100 100 L 0 100 Z' fill='#fefefe' />

      <path d='M 50 0 L 80 100 L 0 230 Z' fill='#000' />
    </svg>
  </div>
));

Emblem.displayName = 'Emblem';

export default Emblem;
