import React from 'react';
import UnsplashContext from 'unsplash/unsplash-context';
import PhotoCard from './Grid/PhotoCard';

const x = 700;

export const PhotoDetails = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto: close } = props;
  if (!photo) return null;
  const [, setDetails] = React.useState(null);

  const unsplash = React.useContext(UnsplashContext);

  React.useEffect(() => {
    unsplash.photos.getPhoto(photo.id).then((p) => {
      console.log('fetched photo details:', p);
      setDetails(p);
    });
  }, [photo, unsplash]);
  const ratio = photo.width / photo.height;

  React.useEffect(() => {}, [photo]);
  return (
    <div ref={ref} className="details-card">
      <PhotoCard
        onClickPhoto={close}
        src={photo.urls.small}
        alt={photo.alt_description}
        photo={photo}
        style={{
          maxWidth: `calc((100vh) * ${ratio})`,
          minWidth: ratio < 1 ? `${x * ratio}px` : `${x}px`,
        }}
      ></PhotoCard>
      <div className="details-info">info goes here</div>
    </div>
  );
});
