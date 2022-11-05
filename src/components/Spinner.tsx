import { memo } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLDivElementAttributes = React.HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;

export interface SpinnerProps extends OmittedHTMLDivElementAttributes {
  children?: never;
}

// MARK: - Constants
const classes = {
  root: 'mrl-spinner',
  rootSvg: 'mrl-spinner__svg',
  circle: 'mrl-spinner__svg__circle',
  internalPath: 'mrl-spinner__svg__internal-path',
};

// MARK: - JSX
const Spinner = memo<SpinnerProps>(({ children, className, ...attributes }) => (
  <div {...attributes} className={concat(classes.root, className, 'transition ease-in-out duration-150')}>
    <svg
      className={concat(classes.rootSvg, 'animate-spin -ml-1 mr-3 h-5 w-5')}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className={concat(classes.circle, 'opacity-25')}
        cx={12}
        cy={12}
        r={10}
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className={concat(classes.internalPath, 'opacity-75')}
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  </div>
));

Spinner.displayName = 'Spinner';

export default Spinner;
