import { LatestPhotos } from "components/Home/LatestPhotos";
import React from 'react';
import Footer from "components/Footer";

const Home = (props) => {
  return (
    <>
    <LatestPhotos />
    <Footer></Footer>
    </>
  );
}
export default Home;