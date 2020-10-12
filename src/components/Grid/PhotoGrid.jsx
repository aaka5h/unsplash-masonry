import React, { Component } from "react";
import PhotoCard from "./PhotoCard";
import styles from './PhotoGrid.module.scss';
import { debounce } from "utils";
import { SlugAnimation } from "components/Animations/SlugAnimation";
import { withRouter, Route } from "react-router-dom";
import { AnimatedModal } from "components/Modal/AnimatedModal";
import { PhotoDetails } from "components/PhotoDetails";


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
class PhotoGridC extends Component {
  state = {
    cols: 3,
  }
  componentDidMount() {
    window.addEventListener('resize', debounce(this.onWindowResize, 200));
    const cols = getCols(window.innerWidth);
    console.log(this.props);
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

  cardClicked = (photo, event) => {
    console.log(photo);
    this.selectedPhoto = photo;
  }
  getPhotos(col) {
    const photos = col.photos.map(photo => <PhotoCard onClick={this.cardClicked} photo={photo} key={photo.id}></PhotoCard>);
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
      <div>
        <div className={styles['photo-grid']} style={{
          '--columns': this.state.cols
        }}>
          {grid.map((col, i) => (<div key={`col-${i}`}>{this.getPhotos(col)}</div>))}
        </div>
        {this.selectedPhoto &&
          <AnimatedModal>
            <PhotoDetails photo={this.selectedPhoto}></PhotoDetails>
          </AnimatedModal>}
      </div>
    );
  }
}

export const PhotoGrid = withRouter(PhotoGridC);