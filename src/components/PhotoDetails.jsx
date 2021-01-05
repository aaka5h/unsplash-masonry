import React from 'react';
import { SlugAnimation } from './Animations/SlugAnimation';
import PhotoCard from './Grid/PhotoCard';

export const PhotoDetails = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto } = props;
  if (!photo) return null;
  return (
    <div ref={ref} className="details-card">
      <SlugAnimation>
        <PhotoCard onClickPhoto={onClickPhoto} photo={photo}></PhotoCard>
        <div className="details-info">info goes here</div>
      </SlugAnimation>
    </div>
  );
});
