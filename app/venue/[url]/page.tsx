import React from 'react';

import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import CardGroup from '@components/Card/CardGroup';

const Page = (): React.JSX.Element => (
  <Master>
    <div className='blur-cover'>
      <div
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
        className='event-cover cover-image flex flex-v-center flex-h-center'
      />
      <div className='cover-info'>
        <div
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          }}
          className='cover-image image'
        />
        <Heading type={1} color='white' text='Venue name goes here' />
        <Heading type={6} color='white' text='Shepherds Bush, London' />
      </div>
    </div>
    <Section className='white-background'>
      <div className='container'>
        <div className='venue-details'>
          <Heading type={4} color='gray' text='Venue details' />
          <div className='paragraph-container gray'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
              sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
              amet.
            </p>
          </div>
        </div>
      </div>
    </Section>

    <Section className='white-background'>
      <div className='container'>
        <Heading type={6} color='gray' text='Address' />
        <div className='paragraph-container'>
          <p className='gray'>Lorem ipsum dolor sit amet consecteteur adispicing elit.</p>
        </div>
        <Heading type={6} color='gray' text='How to get there?' />
        <div className='paragraph-container'>
          <p className='gray'>Lorem ipsum dolor sit amet consecteteur adispicing elit.</p>
          <p className='gray'>
            <a target='_blank' href='/' className='blue'>
              Get directions
            </a>
            &nbsp; &bull; &nbsp;
            <a target='_blank' href='/' className='blue'>
              Show in map
            </a>
          </p>
        </div>
        <Heading type={6} color='gray' text='Accesibility information' />
        <div className='paragraph-container'>
          <p className='gray'>Lorem ipsum dolor sit amet consecteteur adispicing elit.</p>
        </div>
      </div>
    </Section>
  </Master>
);

const title = 'Venue name goes here';
const canonical = 'https://modern-ticketing.com/venue/1';
const description = 'Ticketer is a Ticketer solution';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'Ticketer',
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: 'website',
    siteName: 'Ticketer',
    images: 'https://modern-ticketing.com/logo192.png',
  },
};

export default Page;
