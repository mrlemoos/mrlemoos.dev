import { ReactElement } from 'react';

import concat from '../util/concat';

// MARK: - Types
type HTMLDivElementAttributes = React.HTMLAttributes<HTMLDivElement>;
type OmittedHTMLDivElementAttributes = Omit<HTMLDivElementAttributes, 'children'>;

export interface OverlayProps extends OmittedHTMLDivElementAttributes {
  children?: never;
}

// MARK: - Constants
const classes = {
  root: 'mrl-overlay',
};

// MARK: - JSX
const Overlay = ({ children, className, ...attributes }: OverlayProps): ReactElement => (
  <div {...attributes} className={concat(classes.root, className, 'fixed inset-0 bg-[rgba(0, 0, 0, 0.5)]')} />
);

export default Overlay;
