import React from 'react';
import BaseModal from '../Overlay/Modal';

export const AnimatedModal = React.forwardRef((props, ref) => {
  const { onClose, open, children, className, ...rest } = props;
  console.log('animated modal props:', props);
  return (
    <BaseModal
      className="animated-wrapper"
      backdrop={false}
      dialogTransitionTimeout={0}
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
