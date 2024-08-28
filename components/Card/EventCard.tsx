import React from 'react';
import Link from 'next/link';

// components
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
  ticket?: {
    // Make ticket optional
    price: number;
    quantity: number;
  };
}

const EventCard = ({
  url,
  when,
  name,
  venue,
  image,
  color,
  status,
  ticket = { price: 0, quantity: 0 }, // Default values to prevent errors
}: IProps): React.JSX.Element => {
  const { price, quantity } = ticket; // Destructure safely

  return (
    <div className='card'>
      <Link href={`/event/${url}`}>
        <>
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
            <strong>Status:</strong> {status}
            <p>
              <span className='material-symbols-outlined'>sell</span> {price}
            </p>
            <p>
              <span className='material-symbols-outlined'>production_quantity_limits</span>{' '}
              {quantity}
            </p>
          </div>
        </>
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
};

export default EventCard;
