import React from 'react';
import PhotoCard from './Grid/PhotoCard';

export const PhotoDetails = React.forwardRef((props, ref) => {
  const { photo, onClickPhoto } = props;
  if (!photo) return null;
  return (
    <div ref={ref}>
      Hello from photo details: {photo.id}
      <PhotoCard onClickPhoto={onClickPhoto} photo={photo}></PhotoCard>
    </div>
  );
});
