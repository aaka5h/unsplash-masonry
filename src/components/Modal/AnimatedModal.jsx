import { Portal } from 'components/Portal/Portal';
import React from 'react';

const Backdrop = () => {
  return (<div className="modal-backdrop"></div>);
}
export const AnimatedModal = (props) => {
  return (
    <Portal>
      <div class="modal-container">
        <Backdrop></Backdrop>
        <div className="modal-wrapper">
          <div className="modal">
            {props.children}
          </div>
        </div>
      </div>
    </Portal>
  )
} 