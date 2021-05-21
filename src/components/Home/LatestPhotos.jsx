import React, { Component } from 'react';
import { Unsplash } from 'unsplash/unsplash';
import PhotoGrid from 'components/Grid/PhotoGrid';
import { Route } from 'react-router-dom';
import PhotoCard from 'components/Grid/PhotoCard';
import { PhotoDetails } from 'components/PhotoDetails';
import { AnimatedModal } from 'components/Modal/AnimatedModal';
import { animated, config, Transition } from 'react-spring/renderprops';
import UnsplashContext from 'unsplash/unsplash-context';
import { ObserverComponent } from 'components/IntersectionObserver';
import { ObserverComponent2 } from 'components/IntersectionObserver';

export class LatestPhotos extends Component {
  unsplash;
  state = {
    photos: [],
    page: 0,
  };
  constructor(props) {
    super(props);
    this.unsplash = new Unsplash({
      apiUrl: 'http://localhost:1221',
    });
    this.currentRequests = new Map();
  }

  componentDidMount() {
    this.loadPhotos();
  }

  loadPhotos = () => {
    const { photos, page } = this.state;
    if (this.currentRequests.has(page + 1)) return;
    const p = this.unsplash.photos.getPhotos(page + 1);
    this.currentRequests.set(page + 1, p);
    p.then((data) => {
      console.log('api data:', data);
      this.setState(() => {
        this.currentRequests.delete(page + 1);
        return {
          photos: [...photos, ...data],
          // is this safe to use previous state like this??
          page: page + 1,
        };
      });
    });
  };
  loadMore = () => {
    this.loadPhotos();
  };

  photoDetails = (selectedPhoto, lastOpen, toggle, { width, height, x, y }) => {
    return (
      <AnimatedModal open={!!selectedPhoto} onClose={this.modalClosed}>
        <div>
          <Transition
            config={config.slow}
            from={{
              opacity: 0,
              width: `${width}px`,
              height: `${height}px`,
              transform: `translate3d(${x}px,${y}px,0)`,
              borderRadius: '100px',
            }}
            enter={{
              width: `${window.outerWidth}px`,
              height: `${window.innerHeight}px`,
              opacity: 1,
              transform: `translate3d(0,0,0)`,
              borderRadius: '0',
            }}
            /*   update={{
              width: `${window.innerWidth}px`,
              height: `${window.innerHeight}px`,
              opacity: 1,
              transform: `translate3d(0,0,0)`,
            }} */
            leave={{
              width: `${width}px`,
              height: `${height}px`,
              opacity: 0,
              transform: `translate3d(${x}px,${y}px,0)`,
            }}
            items={selectedPhoto}
          >
            {(p) =>
              p &&
              ((styles) => {
                // console.log('zoom in styles', styles);
                return (
                  <animated.div style={{ ...styles, backgroundColor: p.color }}>
                    <PhotoDetails onClickPhoto={toggle} key={p.id} photo={p} />
                  </animated.div>
                );
              })
            }
          </Transition>
        </div>
      </AnimatedModal>
    );
  };
  render() {
    const { photos } = this.state;
    return (
      <UnsplashContext.Provider value={this.unsplash}>
        <>
          <PhotoGrid
            photos={photos}
            photoAs={PhotoCard}
            detailsAs={this.photoDetails}
            fullscreenDetails={true}
          ></PhotoGrid>
          <Route path="/photos/:photoId" render={() => <div>route rendered</div>}></Route>
          <ObserverComponent2>
            {({ inView, entry, ref }) => {
              if (inView) {
                console.log('div in view now', entry);
              }
              inView && this.loadMore();
              return <div ref={ref}></div>;
            }}
          </ObserverComponent2>
        </>
      </UnsplashContext.Provider>
    );
  }
}
