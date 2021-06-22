import React from 'react';
import cssClasses from './PhotoCard.module.scss';
import {Link} from 'react-router-dom';
import {mergeRefs} from 'utils';
import {ObserverComponent2} from 'components/IntersectionObserver';

export const PhotoImg = React.forwardRef(({ src, alt_description: altDescription, inView }, ref) => {
  return inView ? (
    <img className={cssClasses['photo-card__img']} ref={ref} src={src} alt={altDescription} />
  ) : <div ref={ref}></div>;
});

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
          <ObserverComponent2 initialInView={true}>
            {({ inView, entry, ref }) => {
              return <PhotoImg ref={ref} inView={inView} src={photo.urls.small} alt={photo.alt_description} />;
            }}
          </ObserverComponent2>
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
