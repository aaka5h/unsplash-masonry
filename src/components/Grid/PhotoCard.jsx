import React from 'react';
export const PhotoCard = (props) => {
  const { photo } = props;

  // return <pre>{JSON.stringify(photo, 2, null)}</pre>
  return (
    <div>
      <a href={`photos/${photo.id}`}>
        <img src={photo.urls.small} alt={photo.alt_description} />
      </a>
    </div>
  )
}