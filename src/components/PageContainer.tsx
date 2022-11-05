import { ReactElement, ReactNode } from 'react';

import concat from '../util/concat';

// MARK: - Types
export interface PageContainerProps {
  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-page-container',
};

// MARK: - JSX
const PageContainer = ({ children }: PageContainerProps): ReactElement => (
  <div className={concat(classes.root, 'max-w-7xl mx-1 lg:mx-auto mt-20')}>{children}</div>
);

export default PageContainer;
