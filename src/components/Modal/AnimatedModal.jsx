import React from 'react';
import Modal from './Modal';


export const AnimatedModal = React.forwardRef((props, ref) => {
  const { onClose, open, children, ...rest } = props;
  console.log('animated modal props:', props);
  return (
    <Modal ref={ref} onClose={onClose} open={open}>
     {children}
    </Modal>
  );
});
