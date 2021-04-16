import React from 'react';
import BaseModal from '../Overlay/Modal';
import classNames from 'classnames';
import { useBodyStyles } from './utils';

export const AnimatedModal = React.forwardRef((props, ref) => {
  const { onClose, open, children, className, ...rest } = props;
  console.log('animated modal props:', props);
  const dialogRef = React.useRef();
  const [bodyStyles, onChangeBodyStyles] = useBodyStyles(dialogRef, { overflow: false });

  const handleEntered = React.useCallback(() => {
    console.log('handling modal entered into view');
    onChangeBodyStyles();
  }, [onChangeBodyStyles]);
  return (
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
      <div className={'dialog-content'} ref={dialogRef}>
        {children}
      </div>
    </BaseModal>
  );
});
