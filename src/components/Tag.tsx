import { HTMLAttributes, memo, ReactNode } from 'react';
import concat from '../util/concat';

type HTMLDivElementAttributes = HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;

interface TagProps extends OmittedHTMLDivElementAttributes {
  children: ReactNode;
}

const classes = {
  root: 'mrl-tag',
};

const Tag = memo<TagProps>(({ children, className, ...attributes }) => (
  <div
    className={concat(classes.root, 'rounded-xl bg-gray-200 text-gray-700 text-sm py-1 px-2 w-fit', className)}
    {...attributes}
  >
    {children}
  </div>
));

Tag.displayName = 'Tag';

export default Tag;
