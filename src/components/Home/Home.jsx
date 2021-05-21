import { LatestPhotos } from 'components/Home/LatestPhotos';
import React from 'react';
import Footer from 'components/Footer';
import IntersectionObserverComponent from 'components/IntersectionObserver';

const Home = (props) => {
  return (
    <>
      <IntersectionObserverComponent>
        <LatestPhotos />
        <Footer></Footer>
      </IntersectionObserverComponent>
    </>
  );
};
export default Home;
