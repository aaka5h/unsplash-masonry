import React from 'react';
import cssClasses from './PhotoCard.module.scss';
import { Link } from 'react-router-dom';


const Photo = ({ src, alt_description: altDescription }) => {
  return <img className={cssClasses['photo-card__img']} src={src} alt={altDescription} />
}
const PhotoCard = React.forwardRef((props, ref) => {
  const { photo } = props;
  const paddingBottom = `${(100 * photo.height) / photo.width}%`;
  return (
    <div ref={ref} className='photo-card' onClick={e => props.onClick(photo, e)} >
      <Link className={cssClasses['photo-card__link']} to={`/photos/${photo.id}`}>
        <div className={cssClasses['photo-card__img-wrapper']} style={{ paddingBottom }}>
          <Photo src={photo.urls.small} alt={photo.alt_description} />
        </div>
      </Link>
    </div>
  )
})

export default PhotoCard;