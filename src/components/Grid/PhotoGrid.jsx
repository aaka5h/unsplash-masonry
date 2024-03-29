import React from 'react';
import styles from './PhotoGrid.module.scss';
import { debounce } from 'utils';
import { SlugAnimation } from 'components/Animations/SlugAnimation';
import { withRouter } from 'react-router-dom';
import { canUseDOM } from 'components/Portal/Portal';
import memoize from 'memoize-one';
import classNames from 'classnames';

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
class PhotoGrid extends React.PureComponent {
  state = {
    cols: 3,
    selectedPhoto: null,
    lastOpen: null,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };
  openCardRef = React.createRef();

  componentDidMount() {
    let cols = 3;
    if (canUseDOM) {
      window.addEventListener('resize', debounce(this.onWindowResize, 200));
      cols = getCols(window.innerWidth);
    }
    console.log(this.props);

    this.setState({ cols });
  }

  componentDidUpdate(prevProp) {}

  onWindowResize = (e) => {
    const cols = getCols(window.innerWidth);
    this.setState({ cols, windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    console.log('window resized', cols);
  };

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

  cardClicked = (event, photo, ref) => {
    console.log('clicked reference', ref);
    const { selectedPhoto } = this.state;
    const open = !!selectedPhoto;
    if (!open && ref) {
      this.openCardRef.current = ref;
    }
    let [dimensions] = this.openCardRef.current.getClientRects();
    this.setState({
      width: dimensions.width,
      height: dimensions.height,
      x: dimensions.left,
      y: dimensions.top,
    });
    this.toggle(photo);
  };

  toggle = (photo) => {
    this.setState((prevState) => {
      const sp =
        (photo && photo.id) === (prevState.selectedPhoto && prevState.selectedPhoto.id)
          ? null
          : photo;
      console.log('selecte photo', sp);
      return {
        lastOpen: prevState.selectedPhoto,
        selectedPhoto: sp,
      };
    });
  };

  setSelectedRef = (r) => {
    if (!r) {
      return;
    }
    this.openCardRef.current = r;
  };
  getPhoto = (photo) => {
    const { photoAs: Component } = this.props;
    const { selectedPhoto } = this.state;
    const open = (selectedPhoto && selectedPhoto.id) === photo.id;
    // const openedLast = (lastOpen && lastOpen.id) === photo.id;

    const photoDisp = (
      <Component
        ref={open ? this.setSelectedRef : null}
        onClickPhoto={this.cardClicked}
        key={photo.id}
        photo={photo}
      />
    );

    return photoDisp;
  };

  getGrid = memoize((photos, cols) => {
    const grid = Array.from({ length: cols }).map(() => ({
      photos: [],
      totalHeight: 0,
    }));

    photos.forEach((photo, i) => {
      const col = this.getCol(grid);
      col.totalHeight += photo.height / photo.width;
      col.photos.push(photo);
    });
    return grid.map((g) => g.photos);
  });

  render() {
    const { photos, detailsAs } = this.props;
    const { cols, selectedPhoto, width, height, x, y, windowWidth, windowHeight, lastOpen } =
      this.state;

    const grid = this.getGrid(photos, cols);

    const renderCols = grid.map((photos, i) => (
      <div className={classNames(styles['grid-col'])} key={`col-${i}-of-${cols}`}>
        <SlugAnimation keys={(p) => p.photo.id}>
          {photos.map((p) => this.getPhoto(p))}
        </SlugAnimation>
      </div>
    ));

    const renderedPhoto = detailsAs(
      selectedPhoto,
      lastOpen,
      (e) => {
        this.cardClicked(e, selectedPhoto);
      },
      { width, height, x, y, windowWidth, windowHeight }
    );
    return (
      <>
        {/*  <p style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000, background: 'white' }}>
          {JSON.stringify({ opacity, width, height, m, x, y }, null, 2)}
        </p> */}
        {renderedPhoto}
        <div
          className={styles['photo-grid']}
          style={{
            '--columns': this.state.cols,
          }}
        >
          {renderCols}
        </div>
      </>
    );
  }
}
export default withRouter(PhotoGrid);
