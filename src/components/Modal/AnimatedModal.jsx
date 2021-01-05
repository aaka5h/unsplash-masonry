import React from 'react';
import BaseModal from '../Overlay/Modal';
import classNames from 'classnames';

export const AnimatedModal = React.forwardRef((props, ref) => {
  const { onClose, open, children, className, ...rest } = props;
  console.log('animated modal props:', props);
  return (
    <BaseModal
      className={classNames(className, 'animated-wrapper')}
      backdrop={false}
      dialogTransitionTimeout={600}
      transitionOnAppear={false}
      open={open}
      onClose={onClose}
      ref={ref}
      {...rest}
    >
      {children}
    </BaseModal>
  );
});
