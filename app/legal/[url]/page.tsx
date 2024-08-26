import React from 'react';

import { type Metadata } from 'next';

// components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';

const Page = (): React.JSX.Element => (
  <Master>
    <Section className='white-background'>
      <div className='container'>
        <div className='center'>
          <Heading type={1} color='gray' text='Legal' />
        </div>
      </div>
    </Section>
  </Master>
);

const title = 'Legal';
const canonical = 'https://modern-ticketing.com/legal/';
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
