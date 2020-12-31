import React, { useCallback } from 'react';
import cssClasses from './PhotoCard.module.scss';
import { Link } from 'react-router-dom';
import Measure from 'react-measure';
import { mergeRefs } from 'utils';

const Photo = ({ src, alt_description: altDescription }) => {
  return <img className={cssClasses['photo-card__img']} src={src} alt={altDescription} />;
};

Photo.displayName = 'PhotoImg';

const PhotoCard = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto } = props;
  const paddingBottom = `${(100 * photo.height) / photo.width}%`;

  const innerRef = React.useRef();
  const onResize = React.useCallback((r) => console.log(r), []);
  const onClickCard = useCallback(
    (contentRect) => {
      return (e) => {
        console.log('clicked');
        onClickPhoto(e, photo, contentRect, innerRef.current);
      };
    },
    [onClickPhoto, photo]
  );

  return (
    <Measure
      client
      offset
      // onResize={onResize}
      innerRef={(r) => {
        mergeRefs(ref)(r);
        innerRef.current = r;
      }}
    >
      {({ measureRef, contentRect }) => (
        <div
          ref={measureRef}
          className="photo-card"
          onClick={(e) => onClickPhoto(e, photo, contentRect, innerRef.current)}
        >
          <Link className={cssClasses['photo-card__link']} to={`/photos/${photo.id}`}>
            <div className={cssClasses['photo-card__img-wrapper']} style={{ paddingBottom }}>
              <Photo src={photo.urls.small} alt={photo.alt_description} />
            </div>
          </Link>
        </div>
      )}
    </Measure>
  );
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;
