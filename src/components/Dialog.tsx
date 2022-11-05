import { ReactElement, ReactNode, useCallback, MouseEvent as ReactMouseEvent } from 'react';

import { Root, Content } from '@radix-ui/react-dialog';

import Overlay from './Overlay';

import concat from '../util/concat';

// MARK: - Types
export interface DialogProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onBackdropClick?: React.MouseEventHandler<HTMLElement>;
  closeButton?: boolean;
}

// MARK: - Constants
const classes = {
  root: 'mrl-dialog',
  content: 'mrl-dialog__content',
  title: 'mrl-dialog__title',
  footer: 'mrl-dialog__footer',
  backdrop: 'mrl-dialog__backdrop',
  closeButton: 'mrl-dialog__close-button',
};

// MARK: - JSX
const Dialog = ({
  children,
  open,
  onClose,
  onBackdropClick,
  closeButton = false,
}: DialogProps): ReactElement | null => {
  const handleOpenChange = useCallback(
    (openState: boolean) => {
      if (!openState) {
        onClose();
      }
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (typeof onBackdropClick === 'function') {
        onBackdropClick(event);
      }

      onClose();
    },
    [onBackdropClick, onClose]
  );

  const handleClickCloseButton = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );

  if (!open) {
    return null;
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Overlay
        className={concat(
          classes.backdrop,
          'fixed inset-0 transition-all motion-reduce:transition-none bg-black bg-opacity-80'
        )}
        onClick={handleBackdropClick}
      />
      <Content>
        <div
          className={concat(
            classes.root,
            classes.content,
            'max-w-full sm:max-w-md min-w-[50vw] max-h-[50vh] overflow-auto',
            'rounded-xl bg-white p-3 sm:p-8 shadow-md',
            'fixed inset-t-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'
          )}
        >
          {children}
          {closeButton && (
            <button
              className={concat(
                classes.closeButton,
                'absolute top-5 right-5 w-7 h-7 outline-none border-none',
                'font-sans text-md rounded-full bg-gray-200 text-black hover:bg-red-200 transition-colors'
              )}
              onClick={handleClickCloseButton}
            >
              X
            </button>
          )}
        </div>
      </Content>
    </Root>
  );
};

export default Dialog;
