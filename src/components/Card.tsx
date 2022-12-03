import { HTMLAttributes, ReactElement, ReactNode } from 'react';
import concat from '../util/concat';

// MARK: - Types
type HTMLDivElementAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;

export interface CardProps extends OmittedDivElementAttributes {
  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-card',
};

// MARK: - JSX
const Card = ({ children, className, ...attributes }: CardProps): ReactElement => (
  <div
    className={concat(
      classes.root,
      'p-3 md:p-6 bg-white dark:bg-indigo-700 border-2 border-gray-100 dark:border-indigo-700',
      'rounded-xl min-h-[200px] min-w-[200px] shadow-md hover:shadow-xl transition-all cursor-pointer',
      className
    )}
    {...attributes}
  >
    {children}
  </div>
);

export default Card;
