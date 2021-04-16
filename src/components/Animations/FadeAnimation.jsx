import React from 'react';
import { animated, Transition } from 'react-spring/renderprops';

export const FadeAnimation = React.forwardRef((props, ref) => {
  const {
    children,
    show,
    from = { opacity: 0 },
    enter = { opacity: 1 },
    leave = { opacity: 0 },
    ...rest
  } = props;

  const result = (styles) => {
    const child = React.Children.only(children);
    const Component = animated[child.type] || animated(child.type);
    const newProps = {
      ...child.props,
      style: {
        willChange: 'opacity',
        ...child.props.style,
        ...styles,
      },
    };
    return <Component {...newProps} />;
  };

  return (
    <Transition
      ref={ref}
      items={show}
      from={from}
      enter={enter}
      leave={leave}
      {...rest}
      children={(child) => show && child}
    />
  );
});
