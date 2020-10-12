import React, { useState, useEffect } from 'react';
import { ReactComponent as ReactLogo } from 'react-logo.svg';
import { SlugAnimation } from './Animations/SlugAnimation';

const photographyTypes =
  `portrait
fashion
sports
architecture
products
travel
pets
abstract
adventure
candid
cityscape
fine art
food
landscapes
macro photos
astro photos
wedding`.split('\n');

const getRandomString = function (strings) {
  return strings[Math.floor(Math.random() * strings.length)];
}
const emptySpace = ' ';
const RandomStrings = (props) => {
  const [content, setContent] = useState(emptySpace);
  const [tout, setTout] = useState(null);
  useEffect(() => {
    if (tout) return;
    const t = setTimeout(() => {
      setContent(getRandomString(props.strings));
      console.log('set time out');
      setTout(null);
    }, 4000);
    setTout(t);
  }, [content, props.strings, tout]);
  useEffect(() => {
    console.log('second use effect');
    setContent(getRandomString(photographyTypes));
  }, []);

  const chars = content && content.split('');
  // const chars = 'aakash'.split('');
  return (
    <h2 className="sub-heading">
      <SlugAnimation>
        {chars &&
          chars.map(
            (char, i) => <span style={{ display: 'inline-block' }} key={`${i}-${char}`}>{char}</span>
          )}
      </SlugAnimation>
    </h2>
  )
}

const Header = (props) => {

  return (
    <header className="header">
      <div className="header__content header__content--secondary">
        <RandomStrings strings={photographyTypes}></RandomStrings>
      </div>
      <div className="header__content header__content--main">
        <h1 className="header__title">relive images</h1>
        <div className="image-swiper">
          <div className="swipe-animation__container sub-heading">
            <div className="swipe-animation__content">
              <h2 className="sub-heading">
                Made by <a target="_blank" href="https://twitter.com" aria-label="muscle flexing" role="img">aakash</a> with
          </h2>
            </div>
            <div className="swipe-animation__effect"></div>
          </div>
          <span className="react-logo"><ReactLogo /></span>
        </div>
      </div>


    </header>
  );
}

export default Header;