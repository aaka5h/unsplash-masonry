import React from 'react';
import styles from './PhotoGrid.module.scss';
import { debounce } from 'utils';
import { SlugAnimation } from 'components/Animations/SlugAnimation';
import { withRouter } from 'react-router-dom';
import { canUseDOM } from 'components/Portal/Portal';
import { Transition, animated } from 'react-spring/renderprops';
import memoize from 'memoize-one';

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
    open: null,
    lastOpen: null,
    width: 0,
    height: 0,
  };
  selectedPhotoRef;
  openCardRef;

  componentDidMount() {
    let cols = 3;
    if (canUseDOM) {
      window.addEventListener('resize', debounce(this.onWindowResize, 200));
      cols = getCols(window.innerWidth);
    }
    console.log(this.props);
    this.PhotoAs = animated(this.props.photoAs);

    this.setState({ cols });
  }

  componentDidUpdate(prevProp) {
    if (prevProp.photoAs !== this.props.photoA) {
      this.PhotoAs = animated(this.props.photoAs);
    }
  }

  onWindowResize = (e) => {
    const cols = getCols(window.innerWidth);
    this.setState({ cols });
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

  cardClicked = (event, photo, measure, ref) => {
    console.log('reference', measure, ref);
    this.openCardRef = ref;
    this.setState((prevState) => {
      return ({
      lastOpen: prevState.selectedPhoto,
      selectedPhoto:
        (photo.id === (prevState.selectedPhoto && prevState.selectedPhoto.id)) ? null : photo,
    })});
  };

  resizeOuter = (param) => {
    console.log('on resize outer');
    this.setState({
      outerWidth: param.client.width,
      outerHeight: param.client.height,
    });
  };

  modalClosed = () => {
    this.setState({ selectedPhoto: null });
  };

  getPhoto = (photo) => {
    const { photoAs: Component, detailsAs: PhotoDetails } = this.props;
    const { selectedPhoto } = this.state;
    const renderedPhoto =
      selectedPhoto && selectedPhoto.id === photo.id ? (
        <PhotoDetails onClickPhoto={this.cardClicked} key={photo.id} photo={photo} />
      ) : (
        <Component onClickPhoto={this.cardClicked} key={photo.id} photo={photo} />
      );
    return renderedPhoto;
    return (
      <Transition
        photo={photo}
        keys={(p) => p.id}
        items={photo}
        delay={1000}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {(item) => (props) => <animated.div style={props}>{renderedPhoto}</animated.div>}
      </Transition>
    );
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
    const { photos, photoAs } = this.props;
    const { cols } = this.state;

    const grid = this.getGrid(photos, cols);

    const renderCols = grid.map((photos, i) => (
      <div key={`col-${i}-of-${cols}`}>
        <SlugAnimation keys={(p) => p.photo.id}>
          {photos.map((p) => this.getPhoto(p))}
        </SlugAnimation>
      </div>
    ));

    return (
      <div
        className={styles['photo-grid']}
        style={{
          '--columns': this.state.cols,
        }}
      >
        {renderCols}
      </div>

      // {
      //   <AnimatedModal open={!!selectedPhoto} onClose={this.modalClosed}>
      //     <PhotoDetails photo={selectedPhoto}></PhotoDetails>
      //   </AnimatedModal>
      // }
    );
  }
}
export default withRouter(PhotoGrid);
