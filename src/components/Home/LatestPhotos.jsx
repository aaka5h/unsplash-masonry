import React, { Component } from 'react';
import { Unsplash } from 'unsplash/unsplash';
import { PhotoGrid } from 'components/Grid/PhotoGrid';


export class LatestPhotos extends Component {
  unsplash;
  state = {
    photos: [],
    page: 0,
  }
  constructor(props) {
    super(props);
    this.unsplash = new Unsplash({
      apiUrl: 'http://localhost:1221'
    });
  }

  componentDidMount() {
    this.loadPhotos();
  }

  loadPhotos = () => {
    const { photos, page } = this.state;
    this.unsplash.photos.getPhotos(page + 1)
      .then((data) => {
        console.log('api data:',data);
        this.setState({
          photos: [...photos, ...data],
          // is this safe to use previous state like this??
          page: page + 1
        })
      })
  }
  loadMore = () => {
    this.loadPhotos();
  }

  render() {
    const { photos } = this.state;
    return (
      <>
        <PhotoGrid photos={photos}></PhotoGrid>
        <button onClick={this.loadMore}>Load more</button>
      </>
    )
  }
}