import React from 'react';

import Link from 'next/link';

// components
import Badge from '@components/Badge/Badge';
import ButtonLink from '@components/Button/ButtonLink';

// interfaces
interface IProps {
  url: string;
  when: string;
  name: string;
  venue: string;
  image: string;
  color: string;
  status: string;
}

const EventCard = ({ url, when, name, venue, image, color, status }: IProps): React.JSX.Element => (
  <div className='card'>
    <Link href={`/event/${url}`}>
      <div className='card-title'>
        <h3>{name}</h3>
      </div>
      <div
        className='card-image'
        style={{
          backgroundImage: `url("${image}")`,
        }}
      ></div>
      <div className='card-info'>
        <p>
          <span className='material-symbols-outlined'>event</span> {when}
        </p>
        <p>
          <span className='material-symbols-outlined'>apartment</span> {venue}
        </p>
        <strong>Status</strong> {status}
      </div>
    </Link>
    <div className='card-buttons'>
      <ButtonLink
        color={`${color}-overlay`}
        text='Details'
        rightIcon='arrow_forward'
        url={`event/${url}`}
      />
    </div>
  </div>
);

export default EventCard;
