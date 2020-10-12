
import React from 'react';
import { animated, Transition } from 'react-spring/renderprops';


export const FadeAnimation = (props) => {
  const {
    children,
    from = { opacity: 0 },
    enter = { opacity: 1 },
    leave = { opacity: 0 },
    ...rest
  } = props;

  const result = (styles) => {
    const Component = animated[children.type] || animated(children.type);
    const newProps = {
      ...children.props,
      style: {
        willChange: 'opacity',
        ...children.props.style,
        ...styles
      }
    }
    return <Component {...newProps} />
  }


  return (
    <Transition
      items={result}
      from={from}
      enter={enter}
      leave={leave}
      {...rest}
      children={child => child}
    />
  );
}
