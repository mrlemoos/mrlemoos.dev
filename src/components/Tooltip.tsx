import { ReactElement, ReactNode } from 'react';

import { Provider, Root, Content, Trigger } from '@radix-ui/react-tooltip';

import concat from '../util/concat';

// MARK: - Types
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAxis = 'start' | 'center' | 'end';

export interface TooltipProps {
  side: TooltipSide;
  axis: TooltipAxis;

  sideOffset?: number;
  axisOffset?: number;

  content: ReactNode;

  children: ReactNode;
}

// MARK: - Constants
const classes = {
  root: 'mrl-tooltip',
  anchor: 'mrl-tooltip__anchor',
  content: 'mrl-tooltip__content',
};

// MARK: - JSX
const Tooltip = ({ side, axis, content, children, sideOffset, axisOffset }: TooltipProps): ReactElement => (
  <Provider delayDuration={500}>
    <Root>
      <Trigger className={classes.anchor}>{children}</Trigger>
      <Content
        side={side}
        align={axis}
        sideOffset={sideOffset}
        alignOffset={axisOffset}
        className={concat(classes.root, classes.content, 'bg-white shadow-lg rounded-lg py-3 px-4 opacity-80')}
      >
        {content}
      </Content>
    </Root>
  </Provider>
);

export default Tooltip;
