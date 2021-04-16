import React from 'react';
import cssClasses from './PhotoCard.module.scss';
import { Link } from 'react-router-dom';
import { mergeRefs } from 'utils';

export const PhotoImg = ({ src, alt_description: altDescription }) => {
  return <img className={cssClasses['photo-card__img']} src={src} alt={altDescription} />;
};

PhotoImg.displayName = 'PhotoImg';

const PhotoCard = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto, style } = props;
  const paddingBottom = `${(100 * photo.height) / photo.width}%`;

  const innerRef = React.useRef();

  return (
    <div
      className="photo-card"
      ref={mergeRefs(innerRef, ref)}
      onClick={(e) => onClickPhoto(e, photo, innerRef.current)}
    >
      <Link className={cssClasses['photo-card__link']} to={`/photos/${photo.id}`}>
        <div
          className={cssClasses['photo-card__img-wrapper']}
          style={{ ...style, backgroundColor: photo.color }}
        >
          <PhotoImg src={photo.urls.small} alt={photo.alt_description} />
          <div style={{ paddingBottom }}></div>
        </div>
      </Link>
    </div>
  );
/*   return (
    <Measure
      client
      offset
      bounds
      scroll
      // onResize={onResize}
      innerRef={(r) => {
        mergeRefs(ref)(r);
        innerRef.current = r;
      }}
    >
      {({ measureRef, contentRect }) => null}
    </Measure>
  ); */
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;
