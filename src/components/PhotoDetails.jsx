import React from 'react';
import PhotoCard from './Grid/PhotoCard';

export const PhotoDetails = (props) => {
  const { photo } = props;
  return <div>Hello from photo details: {photo.id}
    <PhotoCard photo={photo}></PhotoCard>
  </div>;
}
