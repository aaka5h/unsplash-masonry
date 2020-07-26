import React, { Component } from "react";
import PhotoCard from "./PhotoCard";
import styles from './PhotoGrid.module.scss';
import { debounce } from "utils";

import { Trail, animated, Transition } from 'react-spring/renderprops';


const SlugAnimation = (props) => {

  const {
    children,
    from = { opacity: 0, transform: 'translate3d(0,30px,0)' },
    to = { opacity: 1, transform: 'translate3d(0,0,0)' },
    ...rest
  } = props;
  const result = React.Children.map(props.children, (child) => ((styles, ref) => {
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
  }))

  return (
    <Trail
      native
      items={result}
      keys={result.map((_, i) => i)}
      {...rest}
      from={from}
      to={to}
      children={child => child}
    />
  );

}


const FadeAnimation = (props) => {
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
    />);
}

function getCols(width) {
  // min width style going small to big
  if (width > 992) {
    return 3;
  }

  if (width > 768) {
    return 2;
  }
  if (width > 576) {
    return 1;
  }
  return 1;

}
export class PhotoGrid extends Component {
  state = {
    cols: 3,
  }
  componentDidMount() {
    window.addEventListener('resize', debounce(this.onWindowResize, 200));
    const cols = getCols(window.innerWidth);
    this.setState({ cols })
  }

  onWindowResize = (e) => {
    const cols = getCols(window.innerWidth);
    this.setState({ cols });
    console.log('window resized', cols);
  }

  getCol(grid) {
    let currentCol;
    let currentHeight;
    for (let i = 0; i < grid.length; i++) {
      const col = grid[i];
      const colHeight = col.totalHeight;
      if (typeof currentHeight === 'undefined' ? !isNaN(colHeight) : colHeight < currentHeight) {
        currentHeight = colHeight;
        currentCol = col;
      }
    }
    return currentCol;
  }

  getPhotos(col) {
    const photos = col.photos.map(photo => <PhotoCard photo={photo} key={photo.id}></PhotoCard>);
    return (
      <SlugAnimation>
        {photos}
      </SlugAnimation>
    );
  }
  render() {
    const { photos } = this.props;
    const { cols } = this.state;

    const grid = Array.from({ length: cols }).map(() => ({ photos: [], totalHeight: 0 }));
    photos.forEach((photo, i) => {
      const col = this.getCol(grid);
      col.totalHeight += photo.height / photo.width;
      col.photos.push(photo);
    });

    return (
      <div className={styles['photo-grid']} style={{
        '--columns': this.state.cols
      }}>

        {grid.map((col, i) => (<div key={`col-${i}`}>{this.getPhotos(col)}</div>)
        )}
      </div>
    );
  }
}