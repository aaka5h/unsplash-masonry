import React, { useCallback } from 'react';
import { SlugAnimation } from './Animations/SlugAnimation';
import PhotoCard from './Grid/PhotoCard';
import { PhotoImg } from './Grid/PhotoCard';

const x = 700;


export const PhotoDetails = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto: close } = props;
  if (!photo) return null;
  const [width, setWidth] = React.useState(0);
  const [minWidth, setMinWidth] = React.useState(0);
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
