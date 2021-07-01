import React from 'react';
import BaseModal from '../Overlay/Modal';
import classNames from 'classnames';
import { useBodyStyles } from './utils';
import { mergeRefs } from 'utils';

export const ModalContext = React.createContext(null);

export const AnimatedModal = React.forwardRef((props, ref) => {
  const { onClose, open, children, className, ...rest } = props;
  console.log('animated modal props:', props);
  const dialogRef = React.useRef(null);
  const [bodyStyles, onChangeBodyStyles] = useBodyStyles(dialogRef, { overflow: true });

  const handleEntered = React.useCallback(() => {
    console.log('handling modal entered into view', dialogRef);
    onChangeBodyStyles();
  }, [onChangeBodyStyles]);
  const context = React.useMemo(
    () => ({
      bodyStyles: () => bodyStyles,
    }),
    [bodyStyles]
  );
  return (
    <ModalContext.Provider value={context}>
      <BaseModal
        className={classNames('animated-wrapper')}
        backdrop={false}
        dialogTransitionTimeout={550}
        transitionOnAppear={true}
        open={open}
        onEntered={handleEntered}
        onClose={onClose}
        ref={ref}
        {...rest}
      >
        {(transitionProps, transitionRef) => {
          const { className, ...restProps } = transitionProps;
          return (
            <div
              {...restProps}
              className={classNames('dialog-content', className)}
              ref={mergeRefs(dialogRef, transitionRef)}
            >
              {children}
            </div>
          );
        }}
      </BaseModal>
    </ModalContext.Provider>
  );
});

AnimatedModal.displayName = 'AnimatedModal';
