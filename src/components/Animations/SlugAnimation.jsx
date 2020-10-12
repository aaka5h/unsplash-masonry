
import React from 'react';
import { Trail, animated } from 'react-spring/renderprops';


export const SlugAnimation = (props) => {

  const {
    children,
    from = { opacity: 0, transform: 'translate3d(0,30px,0)' },
    to = { opacity: 1, transform: 'translate3d(0,0,0)' },
    ...rest
  } = props;
  const result = React.Children.map(props.children,
    (child) => (styles, ref) => {
      const Component = animated[child.type] || animated(child.type);
      const props = {
        ...child.props,
        style: {
          willChange: 'opacity, transform',
          ...child.props.style,
          ...styles,
        }
      }
      return <Component {...props} ref={ref} />
    });

  return (
    <Trail
      native
      {...rest}
      items={result}
      keys={result ? result.map((_, i) => i) : undefined}
      from={from}
      to={to}
      children={child => child}
    />
  );

}